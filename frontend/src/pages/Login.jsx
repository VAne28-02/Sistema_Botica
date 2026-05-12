import { useState } from 'react'
import api from '../api/api'; 
import '../App.css';

export default function Login() {
  
  const [credenciales, setCredenciales] = useState({
    email: '',
    password: ''
  });

  
  const handleChange = (e) => {
    setCredenciales({
      ...credenciales,
      [e.target.name]: e.target.value
    });
  };


const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const { data } = await api.post('/auth/login', credenciales);
      
    
      localStorage.setItem('token', data.token);
      
      
      alert(`¡Bienvenida ${data.usuario.nombre}!`);
      
      
      window.location.href = '/alertas'; 
      
    } catch (err) {
      
      alert("Error: " + (err.response?.data?.error || "No se pudo conectar con el servidor"));
    }
  };

  return (
    <div className="card">
      <h2>Nova Salud</h2>
      <p>Gestión de Botica</p>
      <form onSubmit={handleSubmit}>
        <input 
          name="email" 
          type="email" 
          placeholder="Correo Electrónico" 
          onChange={handleChange} 
          value={credenciales.email}
          required 
        />
        <input 
          name="password" 
          type="password" 
          placeholder="Contraseña" 
          onChange={handleChange} 
          value={credenciales.password}
          required 
        />
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
}