import { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css';

const ListOfLoans = () => {
    const [loans, setLoans] = useState([]);
    const [filteredLoans, setFilteredLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [filterLoanType, setFilterLoanType] = useState('');
    const [filterInterestRate, setFilterInterestRate] = useState('');
    const [selectedLoan, setSelectedLoan] = useState(null);


    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/create-loan');
                setLoans(response.data);
                setFilteredLoans(response.data); // Set both loans and filtered loans
                setLoading(false);
            } catch (error) {
                setError('Error fetching loans');
                console.error(error);
                setLoading(false);
            }
        };

        fetchLoans();
    }, []);

    // Handle loan deletion
    const handleDelete = async (loanId) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:5000/loans/${loanId}`);
            setMessage(response.data.message); // Display success message
            // Remove deleted loan from state
            const updatedLoans = loans.filter((loan) => loan._id !== loanId);
            setLoans(updatedLoans);
            setFilteredLoans(updatedLoans);
        } catch (error) {
            setError('Error deleting loan');
            console.error(error);
        }
    };

    
    useEffect(() => {
        let filtered = loans;

        if (filterLoanType) {
            filtered = filtered.filter(loan => loan.loan_type === filterLoanType);
        }

        if (filterInterestRate) {
            filtered = filtered.filter(loan => parseFloat(loan.interest_rate) <= parseFloat(filterInterestRate));
        }

        setFilteredLoans(filtered);
    }, [filterLoanType, filterInterestRate, loans]);

    // Reset filters and show all loans
    const resetFilters = () => {
        setFilteredLoans(loans);
        setFilterLoanType('');
        setFilterInterestRate('');
    };

    const calculateBreakdown = (loan) => {
        const principal = parseFloat(loan.loan_amount);
      
        const months = parseInt(loan.loan_term);
        const monthlyPayment = parseFloat(loan.monthly_payment);
        
        // Calculate total interest paid over the loan term
        const totalPaid = monthlyPayment * months;
        const totalInterest = totalPaid - principal;

        return {
            totalInterest: totalInterest.toFixed(2),
            totalPaid: totalPaid.toFixed(2)
        };
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="loan-list">
            <h2>List of Loans</h2>

            {message && <p>{message}</p>}

            {/* Filter Options */}
            <div className="filters">
                <div>
                    <label>Filter by Loan Type:</label>
                    <select value={filterLoanType} onChange={(e) => setFilterLoanType(e.target.value)}>
                        <option value="">All</option>
                        <option value="Home">Home</option>
                        <option value="Auto">Auto</option>
                        <option value="Personal">Personal</option>
                        <option value="Student">Student</option>
                    </select>
                </div>

                <div>
                    <label>Filter by Max Interest Rate:</label>
                    <input
                        type="number"
                        value={filterInterestRate}
                        onChange={(e) => setFilterInterestRate(e.target.value)}
                        placeholder="Enter max interest rate"
                    />
                </div>

                <button onClick={resetFilters}>Reset Filters</button>
            </div>

            {/* Loan List Table */}
            <table>
                <thead>
                    <tr>
                        <th>Loan ID</th>
                        <th>Loan Amount</th>
                        <th>Interest Rate (%)</th>
                        <th>Loan Term (months)</th>
                        <th>Monthly Payment</th>
                        <th>Loan Type</th>
                        <th>Actions</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLoans.length > 0 ? (
                        filteredLoans.map((loan) => (
                            <tr key={loan._id}>
                                <td>{loan._id}</td>
                                <td>{loan.loan_amount}</td>
                                <td>{loan.interest_rate}</td>
                                <td>{loan.loan_term}</td>
                                <td>{loan.monthly_payment}</td>
                                <td>{loan.loan_type}</td>
                                <td>
                                    <button 
                                        onClick={() => handleDelete(loan._id)} 
                                        className="delete-btn"
                                    >
                                        Delete
                                    </button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => setSelectedLoan(selectedLoan === loan._id ? null : loan._id)}
                                        className="details-btn"
                                    >
                                        {selectedLoan === loan._id ? 'Hide Details' : 'Show Details'}
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">No loans found matching your criteria.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Loan Details Section */}
            {selectedLoan && (
                <div className="loan-details">
                    {filteredLoans.filter(loan => loan._id === selectedLoan).map((loan) => {
                        const { totalInterest, totalPaid } = calculateBreakdown(loan);
                        return (
                            <div key={loan._id}>
                                <h3>Loan Details</h3>
                                <p><strong>Loan ID:</strong> {loan._id}</p>
                                <p><strong>Loan Amount:</strong> {loan.loan_amount}</p>
                                <p><strong>Interest Rate:</strong> {loan.interest_rate}%</p>
                                <p><strong>Loan Term:</strong> {loan.loan_term} months</p>
                                <p><strong>Monthly Payment:</strong> {loan.monthly_payment}</p>
                                <p><strong>Loan Type:</strong> {loan.loan_type}</p>
                                <p><strong>Total Paid Over Term:</strong> {totalPaid}</p>
                                <p><strong>Total Interest Paid:</strong> {totalInterest}</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ListOfLoans;
