Simple Loan Management Web Application
Objective: Develop a web application that allows users to manage their loans. Users should be able to add new loans, view a summary of outstanding loans, and calculate monthly payments.
Backend (Python):
Flask Setup:
Create a Flask application to serve as the backend.
Use a dictionary to store loan entries, where each entry includes:
Loan ID (integer)
Loan Amount (float)
Interest Rate (float, percentage)
Loan Term (integer, number of months)
Monthly Payment (float, calculated)
Loan Type (string, e.g., Personal, Auto, Mortgage)
Operators & Conditional Statements:
Implement logic to calculate the monthly payment using the formula for loan amortization.
Use conditional statements to categorize loans based on their type or term length (e.g., short-term vs. long-term).
Loops:
Use loops to iterate through the loan list to calculate totals, such as the total outstanding amount.
Functions:
Create functions to:
Add a new loan entry.
Retrieve all loan entries.
Calculate monthly payments using the loan amount, interest rate, and loan term.
Filter loans by type or interest rate.
Dictionaries:
Store and manage loans in a dictionary where each loan is stored as a value with the loan ID as the key.
Input & Output:
Validate user input (e.g., ensuring the loan amount and interest rate are valid numbers).
Output results in JSON format for the frontend to consume.
