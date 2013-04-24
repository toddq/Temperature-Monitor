Temperature-Monitor
===================

Python web app to monitor and graph readings from a temperature sensor with my Raspberry Pi

Forgive me for the half-assed documentation on this project, but it's been a couple months now since I wrote it, and much has been forgotten.  I wanted a temperature probe that could output it's value over a network, so that I could keep tabs on my homebrew while doing other tasks around the house.  I couldn't find a reasonable priced one to buy, so I built one with a Raspberry Pi.

I'm using a DS18B20 sensor (http://www.adafruit.com/products/642) with the 1-wire protocol.  The app is built on Flask, with lots of other help (dependencies).  Bootstrap, Font Awesome, jQuery, HighCharts, AirGram, Flask WTF.

Hopefully someone can take away something useful from this.  Let me know if you have any questions about anything.