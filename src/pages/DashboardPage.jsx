import React, { useState, useEffect } from 'react';
import { getSalaryInsights, getFilters } from '../api/employees';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from 'recharts';

const COLORS = ['#4fc3f7', '#4db6ac', '#ff8a65', '#ba68c8', '#aed581', '#ffb74d', '#e57373', '#64b5f6', '#f06292', '#dce775'];

const fmt = (val) => Number(val).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });

export default function DashboardPage() {
    const [insights, setInsights] = useState(null);
    const [filters, setFilters] = useState({ countries: [], job_titles: [] });
    const [country, setCountry] = useState('');
    const [jobTitle, setJobTitle] = useState('');

    useEffect(() => {
        getFilters().then(setFilters);
    }, []);

    useEffect(() => {
        const params = {};
        if (country) params.country = country;
        if (jobTitle) params.job_title = jobTitle;
        getSalaryInsights(params).then(setInsights);
    }, [country, jobTitle]);

    if (!insights) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;

    const countryStats = insights.by_country || [];
    const titleStats = insights.by_country_and_title || [];
    const topTitles = insights.top_paying_titles || [];
    const headcount = insights.headcount_by_country || {};
    const distribution = insights.salary_distribution || [];

    // Summary cards from country stats
    const totalEmployees = countryStats.reduce((sum, s) => sum + (s.employee_count || 0), 0);
    const overallMin = countryStats.length ? Math.min(...countryStats.map(s => parseFloat(s.min_salary))) : 0;
    const overallMax = countryStats.length ? Math.max(...countryStats.map(s => parseFloat(s.max_salary))) : 0;
    const overallAvg = totalEmployees > 0
        ? countryStats.reduce((sum, s) => sum + parseFloat(s.avg_salary) * s.employee_count, 0) / totalEmployees
        : 0;

    const countryChartData = countryStats.map(s => ({
        country: s.country,
        avg_salary: parseFloat(s.avg_salary),
        count: s.employee_count,
    }));

    const topTitlesData = topTitles.map(t => ({
        title: t.job_title,
        avg_salary: parseFloat(t.avg_salary),
        count: t.employee_count,
    }));

    const distributionData = distribution.map(d => ({
        bucket: `${fmt(d.range_min)} - ${fmt(d.range_max)}`,
        count: d.count,
    }));

    return (
        <div>
            <div className="filter-bar">
                <select value={country} onChange={e => setCountry(e.target.value)}>
                    <option value="">All Countries</option>
                    {filters.countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={jobTitle} onChange={e => setJobTitle(e.target.value)}>
                    <option value="">All Job Titles</option>
                    {filters.job_titles.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
            </div>

            {/* Summary Cards */}
            <div className="cards-row">
                <div className="card">
                    <h3>Total Employees</h3>
                    <div className="value">{totalEmployees.toLocaleString()}</div>
                </div>
                <div className="card">
                    <h3>Min Salary</h3>
                    <div className="value">{fmt(overallMin)}</div>
                </div>
                <div className="card">
                    <h3>Max Salary</h3>
                    <div className="value">{fmt(overallMax)}</div>
                </div>
                <div className="card">
                    <h3>Avg Salary</h3>
                    <div className="value">{fmt(overallAvg.toFixed(0))}</div>
                </div>
            </div>

            {/* Charts */}
            <div className="charts-grid">
                {/* Avg Salary by Country */}
                <div className="chart-card">
                    <h3>Average Salary by Country</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={countryChartData} layout="vertical" margin={{ left: 80 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                            <YAxis type="category" dataKey="country" width={100} tick={{ fontSize: 12 }} />
                            <Tooltip formatter={v => fmt(v)} />
                            <Bar dataKey="avg_salary" radius={[0, 4, 4, 0]}>
                                {countryChartData.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Paying Job Titles */}
                <div className="chart-card">
                    <h3>Top 10 Paying Job Titles</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={topTitlesData} layout="vertical" margin={{ left: 120 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                            <YAxis type="category" dataKey="title" width={140} tick={{ fontSize: 11 }} />
                            <Tooltip formatter={v => fmt(v)} />
                            <Bar dataKey="avg_salary" fill="#4fc3f7" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Headcount by Country */}
                <div className="chart-card">
                    <h3>Headcount by Country</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={Object.entries(headcount).map(([c, n]) => ({ country: c, count: n }))} margin={{ left: 80 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="country" tick={{ fontSize: 11, angle: -30 }} height={60} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#ba68c8" radius={[4, 4, 0, 0]}>
                                {Object.keys(headcount).map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Salary Distribution */}
                <div className="chart-card">
                    <h3>Salary Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={distributionData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="bucket" tick={{ fontSize: 10 }} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#4db6ac" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Avg Salary by Job Title in Country — table */}
            {titleStats.length > 0 && (
                <div className="table-container" style={{ marginTop: 16 }}>
                    <h3 style={{ padding: '16px 16px 0', color: '#555', fontSize: 14 }}>
                        Average Salary by Job Title {country ? `in ${country}` : '(All Countries)'}
                    </h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Country</th>
                            <th>Job Title</th>
                            <th>Avg Salary</th>
                            <th>Employees</th>
                        </tr>
                        </thead>
                        <tbody>
                        {titleStats.slice(0, 20).map((row, i) => (
                            <tr key={i}>
                                <td>{row.country}</td>
                                <td>{row.job_title}</td>
                                <td>{fmt(row.avg_salary)}</td>
                                <td>{row.employee_count}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}