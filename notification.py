#!/usr/bin/python

import httplib, urllib, json, httplib2

KEY    = ""
SECRET = ""
URL    = "api.airgramapp.com"
SUBSCRIBE = "https://" + URL + "/1/subscribe"
SEND      = "https://" + URL + "/1/send"

class Notification:

    email = None
    subscribed = False

    def __init__(self, email):
        self.email = email
        self.subscribe()

    def subscribe(self):
        response = self._post(SUBSCRIBE)
        if response:
            self.subscribed = True
        else:
            print "Error subscribing: " + response.status + " " + response.reason            

    def unsubscribe(self):
        self.subscribed = False

    def send(self, message):
        if self.subscribed:
            response = self._post(SEND, {"msg": message})
        else:
            response = self.send_as_guest(message)
        if not response:
            print "Error sending: " + response.status + " " + response.reason

    def _post(self, url, additional_params={}):
        http = httplib2.Http(disable_ssl_certificate_validation=True)
        http.add_credentials(KEY, SECRET)
        params = urllib.urlencode(dict({"email": self.email}.items() + additional_params.items()))
        response = http.request(url, "POST", params)
        #if response:
        #    print "Successfully posted to " + url
        #else:
        #    print "Error: " + response.status + " " + response.reason
        return response        

    def send_as_guest(self, message):
        #print "sending " + message
        params = urllib.urlencode({'email': self.email, 'msg': message})
        connection = httplib.HTTPSConnection(URL)
        connection.connect()
        connection.request('POST', '/1/send_as_guest', params)
        response = connection.getresponse()
        if response.status != httplib.OK:
            print response.status, response.reason
            print "got result: " + str(response.read())
        connection.close()

if '__main__' == __name__:
   notification = Notification("todd@quessenberry.com")
   #notification.send_as_guest("Test Message")
   notification.send("Temp Warning")
   #notification.unsubscribe()
