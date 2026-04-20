import React, { useState, useEffect, useCallback } from 'react';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee, getFilters } from '../api/employees';
import EmployeeForm from '../components/EmployeeForm';
import Pagination from '../components/Pagination';

export default function EmployeesPage() {
    const [employees, setEmployees] = useState([]);
    const [meta, setMeta] = useState({ current_page: 1, total_pages: 1, total_count: 0 });
    const [filters, setFilters] = useState({ countries: [], job_titles: [] });
    const [search, setSearch] = useState('');
    const [country, setCountry] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [page, setPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    const fetchEmployees = useCallback(async () => {
        const params = { page, per_page: 25 };
        if (search) params.search = search;
        if (country) params.country = country;
        if (jobTitle) params.job_title = jobTitle;
        const data = await getEmployees(params);
        setEmployees(data.employees);
        setMeta(data.meta);
    }, [page, search, country, jobTitle]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    useEffect(() => {
        getFilters().then(setFilters);
    }, []);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleCreate = async (form) => {
        await createEmployee(form);
        setShowForm(false);
        fetchEmployees();
    };

    const handleUpdate = async (form) => {
        await updateEmployee(editing.id, form);
        setEditing(null);
        fetchEmployees();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this employee?')) return;
        await deleteEmployee(id);
        fetchEmployees();
    };

    const formatSalary = (salary, currency) => {
        return Number(salary).toLocaleString('en-US', {
            style: 'currency', currency: currency || 'USD', minimumFractionDigits: 0,
        });
    };

    return (
        <div>
            <div className="toolbar">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={handleSearch}
                />
                <select value={country} onChange={e => { setCountry(e.target.value); setPage(1); }}>
                    <option value="">All Countries</option>
                    {filters.countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={jobTitle} onChange={e => { setJobTitle(e.target.value); setPage(1); }}>
                    <option value="">All Job Titles</option>
                    {filters.job_titles.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Employee</button>
                <span style={{ marginLeft: 'auto', fontSize: 13, color: '#888' }}>
          {meta.total_count} employees
        </span>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Job Title</th>
                        <th>Department</th>
                        <th>Country</th>
                        <th>Salary</th>
                        <th>Hire Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {employees.map(emp => (
                        <tr key={emp.id}>
                            <td>{emp.first_name} {emp.last_name}</td>
                            <td>{emp.email}</td>
                            <td>{emp.job_title}</td>
                            <td>{emp.department}</td>
                            <td>{emp.country}</td>
                            <td>{formatSalary(emp.salary, emp.currency)}</td>
                            <td>{emp.hire_date}</td>
                            <td>
                  <span style={{
                      background: emp.employment_status === 'active' ? '#e8f5e9' : '#ffebee',
                      color: emp.employment_status === 'active' ? '#2e7d32' : '#c62828',
                      padding: '2px 8px', borderRadius: 4, fontSize: 12
                  }}>
                    {emp.employment_status}
                  </span>
                            </td>
                            <td>
                                <button className="btn btn-secondary btn-sm" onClick={() => setEditing(emp)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(emp.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    {employees.length === 0 && (
                        <tr><td colSpan="9" style={{ textAlign: 'center', padding: 40, color: '#999' }}>No employees found</td></tr>
                    )}
                    </tbody>
                </table>
                <Pagination currentPage={meta.current_page} totalPages={meta.total_pages} onPageChange={setPage} />
            </div>

            {showForm && (
                <EmployeeForm employee={null} onSave={handleCreate} onClose={() => setShowForm(false)} />
            )}
            {editing && (
                <EmployeeForm employee={editing} onSave={handleUpdate} onClose={() => setEditing(null)} />
            )}
        </div>
    );
}