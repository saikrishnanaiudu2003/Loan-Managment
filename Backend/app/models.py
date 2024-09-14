from app import app
from bson.objectid import ObjectId

def add_loan(loan_data):
    return app.db.loans.insert_one(loan_data)

def get_all_loans():
    return app.db.loans.find()

def get_loan_by_id(loan_id):
    return app.db.loans.find_one({'_id': ObjectId(loan_id)})

def delete_loan(loan_id):
    return app.db.loans.delete_one({'_id': ObjectId(loan_id)})
