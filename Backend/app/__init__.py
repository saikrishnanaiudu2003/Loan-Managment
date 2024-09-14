from flask import Flask
from pymongo import MongoClient
import certifi
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

# Configure MongoDB client directly
app.mongo_client = MongoClient(
    "mongodb+srv://myAtlasDBUser:Sai123@myatlasclusteredu.qifwasp.mongodb.net/python?retryWrites=true&w=majority",
    tlsCAFile=certifi.where()
)

# Access the database
app.db = app.mongo_client['Loan']


from app import views

