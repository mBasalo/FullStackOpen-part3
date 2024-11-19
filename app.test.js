const request = require('supertest');
const express = require('express');
const app = require('./index.js'); // Asegúrate de exportar `app` desde tu archivo principal

describe('API Tests', () => {
  it('should return "Hello World!" on GET /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('<h1>Hello World!</h1>');
  });

  it('should return all notes on GET /api/persons', async () => {
    const response = await request(app).get('/api/persons');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(3); // Cambia según el número esperado
  });

  it('should return a specific note on GET /api/persons/:id', async () => {
    const response = await request(app).get('/api/persons/1');
    expect(response.status).toBe(200);
    expect(response.body.content).toBe("HTML is not easy");
  });

  it('should return 404 if note is not found on GET /api/persons/:id', async () => {
    const response = await request(app).get('/api/persons/999');
    expect(response.status).toBe(404);
  });

  it('should delete a note on DELETE /api/persons/:id', async () => {
    const response = await request(app).delete('/api/persons/1');
    expect(response.status).toBe(204);
  });

  it('should return the updated list after DELETE /api/persons/:id', async () => {
    await request(app).delete('/api/persons/1');
    const response = await request(app).get('/api/persons');
    expect(response.body).toHaveLength(2);
  });
});
