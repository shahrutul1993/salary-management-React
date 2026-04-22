import client from './client';

export const getEmployees = (params= {}) =>
    client.get('employees',{ params }).then(res => res.data)

export const getEmployee = (id) =>
    client.get(`employees/${id}`).then(res => res.data)

export const createEmployee = (employee) =>
    client.post('employees', { employee }).then(res => res.data)

export const updateEmployee = (id, employee) =>
    client.patch(`/employees/${id}`, { employee }).then(res => res.data);

export const deleteEmployee = (id) =>
    client.delete(`/employees/${id}`);

export const getSalaryInsights = (params = {}) =>
    client.get('/salary_insights', { params }).then(res => res.data);

export const getFilters = () =>
    client.get('/filters').then(res => res.data);
