from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from database import get_db, init_app
from config import Config
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'your_secret_key'
app.config.from_object(Config)

# Initialize DB connection teardown
init_app(app)

# -------------------- ROUTES --------------------

@app.route('/')
def index():
    return render_template('index1.html')

@app.route('/login', methods=['POST'])
def login():
    email = request.form['email']
    password = request.form['password']

    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()

    if user and check_password_hash(user[3], password):
        session['user_id'] = user[0]
        session['user_name'] = user[1]
        return redirect(url_for('welcome'))
    else:
        flash("Invalid email or password", "error")
        return redirect(url_for('index'))

@app.route('/signup', methods=['POST'])
def signup():
    name = request.form['name']
    email = request.form['email']
    password = request.form['password']
    hashed_password = generate_password_hash(password)

    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("INSERT INTO users (name, email, password) VALUES (%s, %s, %s)",
                       (name, email, hashed_password))
        db.commit()
        flash("Signup successful! Please login.", "success")
    except Exception as e:
        db.rollback()
        flash("Error during signup: " + str(e), "error")
    finally:
        cursor.close()
    return redirect(url_for('index'))

@app.route('/welcome')
def welcome():
    return render_template('index.html')

@app.route('/home')
def home():
    user_name = session.get('user_name')
    if not user_name:
        return redirect(url_for('index'))

    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        SELECT DISTINCT doctor_name, appointment_date, appointment_time, issue, status
        FROM appointments
        WHERE user_name = %s
        ORDER BY appointment_date DESC, appointment_time DESC
    """, (user_name,))
    appointments = cursor.fetchall()
    cursor.close()

    formatted = [
        {
            'doctor_name': appt[0],
            'date': appt[1],
            'time': appt[2],
            'issue': appt[3],
            'status': appt[4]
        } for appt in appointments
    ]

    pending = sum(1 for a in formatted if a['status'] == 'Pending')
    completed = sum(1 for a in formatted if a['status'] == 'Completed')
    total = len(formatted)

    return render_template('home.html', appointments=formatted,
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

        db = get_db()
        cursor = db.cursor()
        try:
            cursor.execute("""
                SELECT * FROM appointments
                WHERE user_name = %s AND doctor_name = %s
                AND appointment_date = %s AND appointment_time = %s
            """, (user_name, doctor, date, time))
            existing = cursor.fetchone()

            if existing:
                flash("You already have an appointment with this doctor at that time.", "error")
            else:
                cursor.execute("""
                    INSERT INTO appointments
                    (user_name, doctor_name, issue, appointment_date, appointment_time, status)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (user_name, doctor, issue, date, time, 'Pending'))
                db.commit()
                flash("Appointment booked successfully!", "success")
        except Exception as e:
            db.rollback()
            flash("Error while booking: " + str(e), "error")
        finally:
            cursor.close()
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

    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("""
            SELECT * FROM appointments
            WHERE user_name = %s AND doctor_name = %s
            AND appointment_date = %s AND appointment_time = %s
        """, (user_name, doctor, date, time))
        if cursor.fetchone():
            return jsonify({'message': 'You already booked this slot.'}), 400

        cursor.execute("""
            INSERT INTO appointments
            (user_name, doctor_name, issue, appointment_date, appointment_time, status)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (user_name, doctor, issue, date, time, 'Pending'))
        db.commit()
    except Exception as e:
        db.rollback()
        return jsonify({'message': f'Booking failed: {str(e)}'}), 500
    finally:
        cursor.close()
    return jsonify({'message': 'Appointment booked successfully!'})

@app.route('/medications')
def medications():
    return render_template('medications.html')

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

        db = get_db()
        cursor = db.cursor()
        try:
            cursor.execute("""
                INSERT INTO contact (name, email, subject, message)
                VALUES (%s, %s, %s, %s)
            """, (name, email, subject, message))
            db.commit()
            flash("Your message has been sent successfully!", "success")
        except Exception as e:
            db.rollback()
            flash("Error sending message: " + str(e), "error")
        finally:
            cursor.close()
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

