#!/usr/bin/env python
# coding=utf8

from flask import Flask, render_template, json, jsonify, request, flash
from flask.ext.bootstrap import Bootstrap
from flask.ext.wtf import Form, TextField, HiddenField, ValidationError,\
                          Required, IntegerField
from flask.ext.wtf.html5 import EmailField
from temperature import Temperature
from notification import Notification
import time, datetime, threading, copy

class TargetForm(Form):
    field1 = IntegerField('Target Temperature', 
                          description='Target in degrees Farenheit.')
    field2 = EmailField('Notification', 
                        description='Email address of Airgram account to notify when target reached.',
                        default='todd@quessenberry.com')

app = Flask(__name__)
Bootstrap(app)
temp = Temperature()

app.config['BOOTSTRAP_USE_MINIFIED'] = False
app.config['BOOTSTRAP_USE_CDN'] = False
app.config['BOOTSTRAP_FONTAWESOME'] = True
app.config['SECRET_KEY'] = 'devkey'


@app.route('/', methods=('GET', 'POST',))
def index():
    form = TargetForm()
    if request.method == 'POST' and form.validate():
        target = form.field1.data
        if target < 0:
            temp.clear_target()
        else:
            flash('Target temperature set to ' + str(target) + ' F')
            temp.set_target(target)
            if form.field2.data:
                notification = Notification(form.field2.data)
                temp.add_notification(notification)
    return render_template('index.html', form=form)

@app.route("/data", methods=['GET'])
def data():
    now = datetime.datetime.now()
    target_proximity = 0
    if temp.target_reached:
        target_proximity = 2
    elif temp.target_value and abs(temp.target_value - temp.current_value) < 10:
        target_proximity = 1
    target_increasing = 1 if temp.increasing_target else 0

    info = { 'temperature': str(temp.current_value) + "&deg; F",
             'target_proximity': target_proximity,
             'target_increasing': target_increasing,
             'target_value': temp.target_value,
             'timestamp': now.strftime('%m/%d %I:%M:%S %p')
            }
    return jsonify(info)

@app.route("/data-history", methods=['GET'])
def data_history():
	# multiply timestamps by 1000 for Javascript use
    history = copy.deepcopy( list(temp.historical_values) )
    for elem in history:
        elem[0] = int(elem[0] * 1000)

    return jsonify( { 'history': history } )

if '__main__' == __name__:
    print "Starting app"
    temp.start()
    app.run(host='0.0.0.0', port=80, debug=False, use_reloader=False)
    temp.stop()
    print "Exiting app"
