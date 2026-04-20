import React, { useState, useEffect } from 'react';

const EMPTY = {
    first_name: '', last_name: '', email: '', job_title: '',
    department: '', country: '', salary: '', currency: 'USD',
    hire_date: '', employment_status: 'active',
};

export default function EmployeeForm({employee, onSave, onClose}) {
    const[form,setForm] = useState(EMPTY)
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        if (employee) {
            setForm({
                ...employee,
                hire_date: employee.hire_date?.slice(0, 10) || '',
            });
        } else {
            setForm(EMPTY);
        }
    }, [employee]);
    const handleChange = (e) => {
        setForm({...form,[e.target.name]: e.target.value});
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        try{
            await onSave(form);
        }
        catch (err){
            const msgs = err.response?.data?.errors || ['Something went wrong'];
            setErrors(msgs);
        }
    }
    const isEdit = !!employee;
    return(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <h2>{isEdit ? 'Edit Employee' : 'Add Employee'}</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
                        <div className="form-group">
                            <label>First Name</label>
                            <input name="first_name" value={form.first_name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input name="last_name" value={form.last_name} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input name="email" type="email" value={form.email} onChange={handleChange} required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
                        <div className="form-group">
                            <label>Job Title</label>
                            <input name="job_title" value={form.job_title} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Department</label>
                            <input name="department" value={form.department} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Country</label>
                        <input name="country" value={form.country} onChange={handleChange} required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0 12px' }}>
                        <div className="form-group">
                            <label>Salary</label>
                            <input name="salary" type="number" step="0.01" min="0" value={form.salary} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Currency</label>
                            <select name="currency" value={form.currency} onChange={handleChange}>
                                <option value="USD">USD</option>
                                <option value="GBP">GBP</option>
                                <option value="EUR">EUR</option>
                                <option value="INR">INR</option>
                                <option value="CAD">CAD</option>
                                <option value="AUD">AUD</option>
                                <option value="JPY">JPY</option>
                                <option value="BRL">BRL</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
                        <div className="form-group">
                            <label>Hire Date</label>
                            <input name="hire_date" type="date" value={form.hire_date} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select name="employment_status" value={form.employment_status} onChange={handleChange}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {errors.length > 0 && (
                        <div className="error-text">{errors.join(', ')}</div>
                    )}

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">{isEdit ? 'Update' : 'Create'}</button>
                    </div>
                </form>
            </div>
        </div>
    )


}