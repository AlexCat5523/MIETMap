from flask import Flask, render_template, request, jsonify, redirect, url_for
from credentials import *
import base64

app = Flask(__name__)
app.config['SECRET_KEY'] = SECRET_KEY


@app.route('/', methods=['GET', 'POST', 'FETCH'])
def main():
    return render_template('home.html')


if __name__=='__main__':
    app.run(debug=True)