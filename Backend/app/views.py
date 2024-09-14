from flask import jsonify, request
from app import app
from app.models import add_loan, get_all_loans, get_loan_by_id, delete_loan

def calculate_monthly_payment(loan_amount, interest_rate, loan_term):
    r = interest_rate / 100 / 12
    numerator = r * (1 + r) ** loan_term
    denominator = (1 + r) ** loan_term - 1
    return loan_amount * (numerator / denominator)

@app.route("/", methods=["GET"])
def home_route():
    return "<h1>API Working</h1>"
@app.route('/create-loan', methods=["POST", "GET"])
def create_loan():
    if request.method == "POST":
        data = request.json
        required_fields = ['loan_amount', 'interest_rate', 'loan_term', 'loan_type']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
        
        loan_amount = data.get('loan_amount')
        interest_rate = data.get('interest_rate')
        loan_term = data.get('loan_term')
        loan_type = data.get('loan_type')

        try:
            # Convert inputs to the correct types if necessary
            loan_amount = float(loan_amount)
            interest_rate = float(interest_rate)
            loan_term = int(loan_term)
            
            monthly_payment = calculate_monthly_payment(loan_amount, interest_rate, loan_term)
        except ValueError as e:
            return jsonify({"error": f"Invalid input data: {str(e)}"}), 400
        except Exception as e:
            return jsonify({"error": f"Error in calculation: {str(e)}"}), 500

        try:
            loan_data = {
                'loan_amount': loan_amount,
                'interest_rate': interest_rate,
                'loan_term': loan_term,
                'loan_type': loan_type,
                'monthly_payment': monthly_payment
            }
            loan_id = add_loan(loan_data)
            return jsonify({"message": "Loan Added Successfully", "loan_id": str(loan_id.inserted_id), "monthly_payment": monthly_payment}), 201
        except Exception as e:
            print(f"Error adding loan: {str(e)}")  # Log the error
            return jsonify({"error": str(e)}), 500
    else:
        try:
            loans = get_all_loans()
            result = []
            for loan in loans:
                loan['_id'] = str(loan['_id'])
                result.append(loan)
            return jsonify(result)
        except Exception as e:
            print(f"Error fetching loans: {str(e)}")  # Log the error
            return jsonify({"error": str(e)}), 500
        
@app.route("/loans/<loan_id>", methods=["GET", "DELETE"])
def get_or_delete_loan_by_id(loan_id):
    if request.method == "GET":
        try:
            loan = get_loan_by_id(loan_id)
            if loan:
                loan['_id'] = str(loan['_id'])
                return jsonify(loan)
            return jsonify({'error': "Loan Not Found"}), 404
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        try:
            result = delete_loan(loan_id)
            if result.deleted_count:
                return jsonify({'message': "Successfully deleted"}), 200
            return jsonify({'error': "Loan Not Found"}), 404
        except Exception as e:
            return jsonify({"error": str(e)}), 500
