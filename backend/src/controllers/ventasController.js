const pool = require('../config/db');

const registrarVenta = async (req, res) => {
    const { cliente_nombre, productos } = req.body; 

    try {
        await pool.query('BEGIN'); 


        const ventaRes = await pool.query(
            'INSERT INTO ventas (cliente_nombre) VALUES ($1) RETURNING id',
            [cliente_nombre]
        );
        const ventaId = ventaRes.rows[0].id;

        let totalVenta = 0;

        
        for (const p of productos) {
            
            const prodRes = await pool.query('SELECT precio_venta, stock_actual FROM productos WHERE id = $1', [p.producto_id]);
            const producto = prodRes.rows[0];

            const subtotal = producto.precio_venta * p.cantidad;
            totalVenta += subtotal;

            
            await pool.query(
                'INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, subtotal) VALUES ($1, $2, $3, $4)',
                [ventaId, p.producto_id, p.cantidad, subtotal]
            );

            
            await pool.query(
                'UPDATE productos SET stock_actual = stock_actual - $1 WHERE id = $2',
                [p.cantidad, p.producto_id]
            );
        }

    
        await pool.query('UPDATE ventas SET total_venta = $1 WHERE id = $2', [totalVenta, ventaId]);

        await pool.query('COMMIT'); // 
        res.status(201).json({ mensaje: 'Venta registrada y stock actualizado', ventaId, total: totalVenta });

    } catch (err) {
        await pool.query('ROLLBACK'); 
        console.error(err);
        res.status(500).json({ error: 'Error al procesar la venta' });
    }
};

const obtenerReporteDetallado = async (req, res) => {
    try {
        const query = `
            SELECT 
                v.id AS ticket_nro,
                v.fecha_venta,
                v.cliente_nombre,
                p.nombre AS medicamento,
                dv.cantidad,
                p.precio_venta AS precio_unitario,
                dv.subtotal,
                v.total_venta AS total_del_ticket
            FROM ventas v
            JOIN detalle_ventas dv ON v.id = dv.venta_id
            JOIN productos p ON dv.producto_id = p.id
            ORDER BY v.fecha_venta DESC;
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error("Error en reporte:", err.message);
        res.status(500).json({ error: 'Error al generar el reporte' });
    }
};

module.exports = { registrarVenta , obtenerReporteDetallado};