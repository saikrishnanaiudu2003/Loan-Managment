import { useState } from 'react';
import axios from 'axios';
import './index.css';

const AddLoan = () => {
    const [loanAmount, setLoanAmount] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [loanTerm, setLoanTerm] = useState('');
    const [loanType, setLoanType] = useState('');
    const [message, setMessage] = useState('');
    const [showForm, setShowForm] = useState(false); 
    const handleSubmit = async (e) => {
        e.preventDefault();
        const loanData = {
            loan_amount: loanAmount,
            interest_rate: interestRate,
            loan_term: loanTerm,
            loan_type: loanType
        };
        try {
            const response = await axios.post('http://127.0.0.1:5000/create-loan', loanData);
            setMessage(response.data.message);
            // Reset form and hide it after submission
            setLoanAmount('');
            setInterestRate('');
            setLoanTerm('');
            setLoanType('');
            setShowForm(false);
        } catch (error) {
            setMessage('Error creating loan');
            console.log(error);
        }
    };

    return (
        <div className="add-loan">
            <h2>Add Loan</h2>
            {message && <p>{message}</p>}

            {/* Show Add Loan button initially, hide when form is visible */}
            {!showForm && (
                <button onClick={() => setShowForm(true)}>Add Loan</button>
            )}

            {/* Loan form, only visible when the user clicks Add Loan button */}
            {showForm && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Loan Amount:</label>
                        <input 
                            type="number" 
                            value={loanAmount} 
                            onChange={(e) => setLoanAmount(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label>Interest Rate (%):</label>
                        <input 
                            type="number" 
                            step="0.01" 
                            value={interestRate} 
                            onChange={(e) => setInterestRate(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label>Loan Term (months):</label>
                        <input 
                            type="number" 
                            value={loanTerm} 
                            onChange={(e) => setLoanTerm(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label>Loan Type:</label>
                        <select 
                            value={loanType} 
                            onChange={(e) => setLoanType(e.target.value)} 
                            required
                        >
                            <option value="">Select Loan Type</option>
                            <option value="Personal">Personal</option>
                            <option value="Auto">Auto</option>
                            <option value="Mortgage">Mortgage</option>
                        </select>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            )}
        </div>
    );
}

export default AddLoan;
