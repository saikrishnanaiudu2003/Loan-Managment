def calculate_monthly_payment(loan_amount, interest_rate, loan_term):
    r = interest_rate / 100 / 12
    numerator = r * (1 + r) ** loan_term
    denominator = (1 + r) ** loan_term - 1
    return loan_amount * (numerator / denominator)
