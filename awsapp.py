from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
import boto3
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from boto3.dynamodb.conditions import Key
import os

app = Flask(__name__)
app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'default_secret_key')

# AWS Region and Resources
region = 'us-east-1'
dynamodb = boto3.resource('dynamodb', region_name=region)
sns = boto3.client('sns', region_name=region)

# DynamoDB Tables
user_table = dynamodb.Table('Users')
appt_table = dynamodb.Table('Appointments')
med_table = dynamodb.Table('Medications')
contact_table = dynamodb.Table('Contact')

# SNS Topic ARN (replace with your actual ARN)
SNS_TOPIC_ARN = os.environ.get('SNS_TOPIC_ARN', 'arn:aws:sns:ap-south-1:your-account-id:MedTrackReminders')

@app.route('/')
def index():
    return render_template('index1.html')

@app.route('/login', methods=['POST'])
def login():
    email = request.form['email']
    password = request.form['password']

    try:
        response = user_table.get_item(Key={'email': email})
        user = response.get('Item')
        if user and check_password_hash(user['password'], password):
            session['user_id'] = user['email']
            session['user_name'] = user['name']
            return redirect(url_for('welcome'))
        else:
            flash("Invalid email or password", "error")
    except Exception as e:
        flash(f"Login failed: {str(e)}", "error")
    return redirect(url_for('index'))

@app.route('/signup', methods=['POST'])
def signup():
    name = request.form['name']
    email = request.form['email']
    password = request.form['password']
    hashed_password = generate_password_hash(password)

    try:
        user_table.put_item(Item={
            'email': email,
            'name': name,
            'password': hashed_password
        })
        flash("Signup successful! Please login.", "success")
    except Exception as e:
        flash(f"Signup failed: {str(e)}", "error")
    return redirect(url_for('index'))

@app.route('/welcome')
def welcome():
    return render_template('index.html')

@app.route('/home')
def home():
    user_name = session.get('user_name')
    if not user_name:
        return redirect(url_for('index'))

    try:
        response = appt_table.query(
            IndexName='user_name-index',
            KeyConditionExpression=Key('user_name').eq(user_name)
        )
        appointments = response.get('Items', [])
    except Exception as e:
        flash(f"Error fetching appointments: {str(e)}", "error")
        appointments = []

    pending = sum(1 for a in appointments if a['status'] == 'Pending')
    completed = sum(1 for a in appointments if a['status'] == 'Completed')
    total = len(appointments)

    return render_template('home.html', appointments=appointments,
                           pending=pending, completed=completed, total=total)

@app.route('/book-appointment', methods=['GET', 'POST'])
def book_appointment():
    if 'user_name' not in session:
        flash("Please login to book an appointment.", "error")
        return redirect(url_for('index'))

    if request.method == 'POST':
        user_name = session['user_name']
        doctor = request.form['selectedDoctor']
        date = request.form['date']
        time = request.form['time']
        issue = request.form['description']

        try:
            appt_table.put_item(Item={
                'user_name': user_name,
                'doctor_name': doctor,
                'issue': issue,
                'appointment_date': date,
                'appointment_time': time,
                'status': 'Pending'
            })

            sns.publish(
                Message=f"Reminder: Appointment with Dr. {doctor} on {date} at {time}.",
                Subject="MedTrack Appointment Reminder",
                TopicArn=SNS_TOPIC_ARN
            )

            flash("Appointment booked and reminder sent!", "success")
        except Exception as e:
            flash(f"Error: {str(e)}", "error")
        return redirect(url_for('home'))

    return render_template('book-appointment.html')

@app.route('/available-doctors')
def available_doctors():
    return render_template('doctors.html')

@app.route('/book-from-doctor', methods=['POST'])
def book_from_doctor():
    if 'user_name' not in session:
        return jsonify({'message': 'Login required'}), 401

    data = request.get_json()
    doctor = data.get('doctor')
    issue = data.get('issue', 'General Consultation')
    date = data.get('date')
    time = data.get('time')
    user_name = session['user_name']

    try:
        appt_table.put_item(Item={
            'user_name': user_name,
            'doctor_name': doctor,
            'issue': issue,
            'appointment_date': date,
            'appointment_time': time,
            'status': 'Pending'
        })

        sns.publish(
            Message=f"Reminder: Appointment with Dr. {doctor} on {date} at {time}.",
            Subject="MedTrack Appointment Reminder",
            TopicArn=SNS_TOPIC_ARN
        )

        return jsonify({'message': 'Appointment booked and reminder sent!'})
    except Exception as e:
        return jsonify({'message': f'Booking failed: {str(e)}'}), 500

@app.route('/reminders')
def reminders():
    return render_template('reminders.html')

@app.route('/reports')
def reports():
    return render_template('reports.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        subject = request.form['subject']
        message = request.form['message']

        try:
            contact_table.put_item(Item={
                'name': name,
                'email': email,
                'subject': subject,
                'message': message,
                'timestamp': datetime.utcnow().isoformat()
            })
            flash("Your message has been sent successfully!", "success")
        except Exception as e:
            flash(f"Error sending message: {str(e)}", "error")
        return redirect(url_for('contact'))

    return render_template('contact.html')

@app.route('/support')
def support():
    return render_template('support.html')

@app.route('/logout')
def logout():
    session.clear()
    flash("You have been logged out.", "success")
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
