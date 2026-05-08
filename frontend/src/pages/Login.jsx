import { useState } from 'react';
import api from '../api/api'; // Asegúrate de que esta ruta a tu axios sea correcta
import '../App.css';

export default function Login() {
  // 1. Definimos el estado para los datos del formulario
  const [credenciales, setCredenciales] = useState({
    email: '',
    password: ''
  });

  // 2. Función para capturar lo que escribes en los inputs
  const handleChange = (e) => {
    setCredenciales({
      ...credenciales,
      [e.target.name]: e.target.value
    });
  };

  // 3. Función para enviar los datos al Backend al hacer clic en el botón
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Enviamos los datos una sola vez
      const { data } = await api.post('/auth/login', credenciales);
      
      // 2. Guardamos el token (nuestro carnet de acceso)
      localStorage.setItem('token', data.token);
      
      // 3. Avisamos al usuario
      alert(`¡Bienvenida ${data.usuario.nombre}!`);
      
      // 4. Redirigimos a la página de alertas de stock
      window.location.href = '/alertas'; 
      
    } catch (err) {
      // Manejo de errores (por si la clave está mal o el servidor está apagado)
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