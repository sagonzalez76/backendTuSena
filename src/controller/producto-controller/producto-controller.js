import { producto } from "../../models/productos-models/productos-models.js";
import { funcionario_producto } from "../../models/funcionario_producto-models/funcionario_producto-models.js";
import { producto_programa } from "../../models/producto_programa/producto_programa_models.js";
// se importa los modelos de productos a los controladores para ser creados
import { sequelize } from "../../db/db.js";
import { funcionario } from "../../models/funcionario-models/funcionario-models.js";
import { programas } from "../../models/programa-models/programa-models.js";
import { semilleros } from "../../models/semilleros-models/semilleros-models.js";

// se hace la conexion con la base de datos esto sirve para hacer las consultas de los crud de obtener para realizar la consulta por query
const Op = Sequelize.Op;

import { Sequelize } from "sequelize";
// permite manipular varios modelos o tablas de sql
// import readXlsxFile from "read-excel-file/node";
import fs from "fs";

import multer from "multer";
import path from "path";

import { fileURLToPath } from "url";
const filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filename);

export const getData = async (req, res) => {
  const query = req.query.valor;

  try {
    const resultados = await sequelize.query(
      `SELECT productos.${query}, COUNT(*) AS cantidad
      FROM productos
      JOIN (
        SELECT DISTINCT ON (producto_fk) *
        FROM funcionario_productos
        ) AS funcionario_productos
  
        ON productos.producto_id = funcionario_productos.producto_fk
      JOIN funcionario
        ON funcionario.funcionario_id = funcionario_productos.funcionario_fk
      JOIN semilleros
        ON semilleros.semillero_id = productos.semillero_fk
      JOIN proyecto
        ON proyecto.proyecto_id = productos.proyecto_fk
      JOIN (
        SELECT DISTINCT ON (productos_fk) *
        FROM producto_programa
        ) AS producto_programa
    
    
        ON producto_programa.productos_fk = productos.producto_id
      JOIN programa
        ON programa.programa_id = producto_programa.programa_fk
      GROUP BY productos.${query}`,
      {
        replacements: { query },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      message: "Subtipo",
      resultados,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los datos.",
      error: error,
    });
  }
};

export const getproducto = async (req, res) => {
  try {
    const nuevo_producto = await sequelize.query(
      `SELECT productos.*,
        ARRAY_AGG(DISTINCT funcionario.funcionario_id) AS funcionarios_ids,
        ARRAY_AGG(DISTINCT funcionario.funcionario_nombre) AS funcionarios_nombres,
        ARRAY_AGG(DISTINCT funcionario.funcionario_apellido) AS funcionarios_apellidos,
        ARRAY_AGG(DISTINCT funcionario.funcionario_correo) AS funcionarios_correos,
        semilleros.*,
        productos.proyecto_fk,
        proyecto.proyecto_id, proyecto.proyecto_codigo, proyecto.proyecto_linea, proyecto.proyecto_nombre, proyecto.proyecto_presupuesto,
        ARRAY_AGG(DISTINCT programa.programa_id) AS programas_ids,
        ARRAY_AGG(DISTINCT programa.programa_nombre) AS programas_nombres

      FROM productos
      JOIN funcionario_productos ON productos.producto_id = funcionario_productos.producto_fk
      JOIN funcionario ON funcionario.funcionario_id = funcionario_productos.funcionario_fk
      JOIN semilleros ON semilleros.semillero_id = productos.semillero_fk
      JOIN proyecto ON proyecto.proyecto_id = productos.proyecto_fk
      JOIN producto_programa ON producto_programa.productos_fk = productos.producto_id
      JOIN programa ON programa.programa_id = producto_programa.programa_fk
      GROUP BY productos.producto_id, semilleros.semillero_id, semilleros.semillero_nombre, productos.proyecto_fk, proyecto.proyecto_id, proyecto.proyecto_codigo, proyecto.proyecto_linea, proyecto.proyecto_nombre, proyecto.proyecto_presupuesto`
    );

    const productos = nuevo_producto[0];
    const result = productos.map((producto) => ({
      producto_id: producto.producto_id,
      producto_imagen: producto.producto_imagen,
      producto_titulo: producto.producto_titulo,
      producto_ano: producto.producto_ano,
      producto_tipo: producto.producto_tipo,
      producto_subtipo: producto.producto_subtipo,
      producto_url: producto.producto_url,
      funcionarios: producto.funcionarios_ids.map((funcionarioId, index) => ({
        funcionario_id: funcionarioId,
        funcionario_nombre: producto.funcionarios_nombres[index],
        funcionario_apellido: producto.funcionarios_apellidos[index],
        funcionario_correo: producto.funcionarios_correos[index],
      })),
      semillero: {
        semillero_id: producto.semillero_id,
        semillero_nombre: producto.semillero_nombre,
      },
      proyecto: {
        proyecto_id: producto.proyecto_id,
        proyecto_codigo: producto.proyecto_codigo,
        proyecto_linea: producto.proyecto_linea,
        proyecto_nombre: producto.proyecto_nombre,
        proyecto_presupuesto: producto.proyecto_presupuesto,
      },
      programas: producto.programas_ids.map((programaId, index) => ({
        programa_id: programaId,
        programa_nombre: producto.programas_nombres[index],
      })),
    }));

    res.status(200).json({
      success: true,
      message: "Listado de productos",
      productos: result,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const create_producto = async (req, res) => {
  try {
    const { mimetype, path } = req.file;
    fs.renameSync(path, path + "." + mimetype.split("/")[1]);

    const imagenData = fs
      .readFileSync(path + "." + mimetype.split("/")[1])
      .toString("base64");
    const {
      producto_titulo,
      producto_ano,
      producto_tipo,
      producto_subtipo,
      producto_url,
      proyecto_fk,
      semillero_fk,
    } = req.body;

    console.log(req.body.funcionario_fk);
    const funcionario_fk = Array.isArray(req.body.funcionario_fk)
      ? req.body.funcionario_fk
      : req.body.funcionario_fk.split(",");

    const programa_fk = Array.isArray(req.body.programa_fk)
      ? req.body.programa_fk
      : req.body.programa_fk.split(",");
    console.log(funcionario_fk);

    const nuevo_producto = await producto.create({
      producto_titulo,
      producto_ano,
      producto_tipo,
      producto_subtipo,
      producto_imagen: imagenData,
      producto_url,
      proyecto_fk,
      semillero_fk,
    });

    let nuevos_funcionarios = [];
    if (funcionario_fk && funcionario_fk.length > 0) {
      const asociacionesFuncionarioProducto = funcionario_fk.map((id) => ({
        funcionario_fk: id,
        producto_fk: nuevo_producto.producto_id,
      }));
      await funcionario_producto.bulkCreate(asociacionesFuncionarioProducto);

      nuevos_funcionarios = await funcionario.findAll({
        where: { funcionario_id: funcionario_fk },
      });
    }

    let nuevos_programas = [];
    if (programa_fk && programa_fk.length > 0) {
      const asociacionesProgramaProducto = programa_fk.map((id) => ({
        programa_fk: id,
        productos_fk: nuevo_producto.producto_id,
      }));
      await producto_programa.bulkCreate(asociacionesProgramaProducto);

      nuevos_programas = await programas.findAll({
        where: { programa_id: programa_fk },
      });
    }

    const productoCompleto = {
      producto_id: nuevo_producto.producto_id,
      producto_titulo,
      producto_ano,
      producto_tipo,
      producto_imagen: imagenData,
      producto_subtipo,
      producto_url,
      proyecto_fk,
      semillero_fk,
      funcionarios: nuevos_funcionarios,
      programas: nuevos_programas,
    };
    fs.unlinkSync(path + "." + mimetype.split("/")[1]);

    res.status(200).json({
      message: 'Se creó el producto correctamente.',
      producto: productoCompleto,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};

export const update_producto = async (req, res) => {
  const {
    producto_id,
    producto_imagen,
    producto_titulo,
    producto_ano,
    producto_tipo,
    producto_subtipo,
    producto_url,
    proyecto_fk,
    semillero_fk,
    funcionario_fk,
    programa_fk,
  } = req.body;

  try {
    await producto.update(
      {
        producto_imagen,
        producto_titulo,
        producto_ano,
        producto_tipo,
        producto_subtipo,
        producto_url,
        proyecto_fk,
        semillero_fk,
        // funcionario_fk,
      },
      {
        where: {
          producto_id: producto_id,
        },
      }
    );

    await funcionario_producto.update(
      {
        funcionario_fk,
      },
      {
        where: {
          producto_fk: producto_id,
        },
      }
    );

    await producto_programa.update(
      {
        programa_fk,
      },
      {
        where: {
          productos_fk: producto_id,
        },
      }
    );

    const updatedProducto = await producto.findByPk(producto_id);
    const updatedFuncionarioProducto = await funcionario_producto.findOne({
      where: {
        producto_fk: producto_id,
      },
    });
    const updatedProductoPrograma = await producto_programa.findOne({
      where: {
        productos_fk: producto_id,
      },
    });

    res.status(200).json({
      message: "El producto se actualizó correctamente.",
      updatedProducto,
      updatedFuncionarioProducto,
      updatedProductoPrograma,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};

export const delete_producto = async (req, res) => {
  const { producto_id } = req.params;

  try {
    // Eliminar el producto
    const deletedProducto = await producto.destroy({
      where: {
        producto_id: producto_id,
      },
    });

    // Eliminar las relaciones en funcionario_producto y producto_programa
    await funcionario_producto.destroy({
      where: {
        producto_fk: producto_id,
      },
    });

    await producto_programa.destroy({
      where: {
        productos_fk: producto_id,
      },
    });

    res.status(200).json({
      message: "El producto se eliminó correctamente.",
      deletedProducto,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};


export const get_producto_id = async (req, res) => {
  const productoId = req.params.producto_id;

  try {
    const producto = await sequelize.query(
      `SELECT productos.*,
      ARRAY_AGG(DISTINCT funcionario.funcionario_id) AS funcionarios_ids,
      ARRAY_AGG(DISTINCT funcionario.funcionario_nombre) AS funcionarios_nombres,
      ARRAY_AGG(DISTINCT funcionario.funcionario_apellido) AS funcionarios_apellidos,
      ARRAY_AGG(DISTINCT funcionario.funcionario_correo) AS funcionarios_correos,
      semilleros.*,
      productos.proyecto_fk,
      proyecto.proyecto_id, proyecto.proyecto_codigo, proyecto.proyecto_linea, proyecto.proyecto_nombre, proyecto.proyecto_presupuesto,
      ARRAY_AGG(DISTINCT programa.programa_id) AS programas_ids,
      ARRAY_AGG(DISTINCT programa.programa_nombre) AS programas_nombres

    FROM productos
    JOIN funcionario_productos ON productos.producto_id = funcionario_productos.producto_fk
    JOIN funcionario ON funcionario.funcionario_id = funcionario_productos.funcionario_fk
    JOIN semilleros ON semilleros.semillero_id = productos.semillero_fk
    JOIN proyecto ON proyecto.proyecto_id = productos.proyecto_fk
    JOIN producto_programa ON producto_programa.productos_fk = productos.producto_id
    JOIN programa ON programa.programa_id = producto_programa.programa_fk
    WHERE productos.producto_id = :productoId
    
    GROUP BY productos.producto_id, semilleros.semillero_id, semilleros.semillero_nombre, productos.proyecto_fk, proyecto.proyecto_id, proyecto.proyecto_codigo, proyecto.proyecto_linea, proyecto.proyecto_nombre, proyecto.proyecto_presupuesto`,

      {
        replacements: { productoId },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    const productos = producto;
    const result = productos.map((producto) => ({
      producto_id: producto.producto_id,
      producto_imagen: producto.producto_imagen,
      producto_titulo: producto.producto_titulo,
      producto_ano: producto.producto_ano,
      producto_tipo: producto.producto_tipo,
      producto_subtipo: producto.producto_subtipo,
      producto_url: producto.producto_url,
      funcionarios: producto.funcionarios_ids.map((funcionarioId, index) => ({
        funcionario_id: funcionarioId,
        funcionario_nombre: producto.funcionarios_nombres[index],
        funcionario_apellido: producto.funcionarios_apellidos[index],
        funcionario_correo: producto.funcionarios_correos[index],
      })),
      semillero: {
        semillero_id: producto.semillero_id,
        semillero_nombre: producto.semillero_nombre,
      },
      proyecto: {
        proyecto_id: producto.proyecto_id,
        proyecto_codigo: producto.proyecto_codigo,
        proyecto_linea: producto.proyecto_linea,
        proyecto_nombre: producto.proyecto_nombre,
        proyecto_presupuesto: producto.proyecto_presupuesto,
      },
      programas: producto.programas_ids.map((programaId, index) => ({
        programa_id: programaId,
        programa_nombre: producto.programas_nombres[index],
      })),
    }));

    if (producto.length === 0) {
      return res.status(404).json({ success: false, message: "No se encontró el producto" });
    }

    const formattedProducto = {
      ...producto[0],
      funcionario_fk: producto[0].funcionario_fk.map(Number),
      programa_fk: producto[0].programa_fk.map(Number),
    };

    res.status(200).json({ success: true, message: "Producto encontrado", producto: formattedProducto });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


export const get_funcionario_identificacion = async (req, res) => {
  const funcionarioiden = req.params.funcionario_iden;
  try {
    const producto = await sequelize.query(

      // `SELECT productos.*, funcionario.*, proyecto.*, semilleros.*, programa.*
      // FROM productos
      // JOIN funcionario_productos 
      // ON productos.producto_id = funcionario_productos.producto_fk
      // JOIN funcionario
      // ON funcionario.funcionario_id = funcionario_productos.funcionario_fk
      // JOIN semilleros
      // ON semilleros.semillero_id = productos.semillero_fk
      // JOIN proyecto
      // ON proyecto.proyecto_id = productos.proyecto_fk
      // JOIN producto_programa
      // ON producto_programa.productos_fk = productos.producto_id
      // JOIN programa
      // ON programa.programa_id = producto_programa.programa_fk
      // WHERE funcionario.funcionario_iden = :funcionarioiden`,


      `SELECT productos.*, funcionario.*, proyecto.*, semilleros.*, programa.*
      FROM productos
  
      JOIN funcionario_productos
  
      ON productos.producto_id = funcionario_productos.producto_fk
      JOIN funcionario
      ON funcionario.funcionario_id = funcionario_productos.funcionario_fk
      JOIN semilleros
      ON semilleros.semillero_id = productos.semillero_fk
      JOIN proyecto
      ON proyecto.proyecto_id = productos.proyecto_fk
  
      JOIN (
        SELECT DISTINCT ON (productos_fk) *
        FROM producto_programa
        ) AS producto_programa
  
  
  
      ON producto_programa.productos_fk = productos.producto_id
      JOIN programa
      ON programa.programa_id = producto_programa.programa_fk
      WHERE funcionario.funcionario_iden = :funcionarioiden`,
      {
        replacements: { funcionarioiden },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (producto.length === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "No se encontró el producto de funcionario",
        });
    }

    res
      .status(200)
      .json({ success: true, message: "funcionario encontrado", producto });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const filtrosemilleros = async (req, res) => {
  const semilleroNombre = req.query.semillero_nombre;
  console.log(semilleroNombre);
  if (!Array.isArray(semilleroNombre)) {
    return res
      .status(400)
      .send("Los autores deben ser proporcionados como un array");
  }

  const filtrosSemillero = semilleroNombre.map((autor) => `%${autor}%`);

  try {
    const semillero = await sequelize.query(
      `SELECT productos.*, funcionario.*,proyecto.*,semilleros.*,programa.*
      FROM productos
      JOIN funcionario_productos 
      ON productos.producto_id = funcionario_productos.producto_fk
      JOIN funcionario
      ON funcionario.funcionario_id = funcionario_productos.funcionario_fk
      JOIN  semilleros
      ON semilleros.semillero_id = productos.semillero_fk
      JOIN  proyecto
      ON proyecto.proyecto_id = productos.proyecto_fk
      JOIN producto_programa
      ON producto_programa.productos_fk = productos.producto_id
      JOIN programa
      ON programa.programa_id = producto_programa.programa_fk      
	   WHERE semilleros.semillero_nombre LIKE ANY(ARRAY[:filtrosSemillero])`,
      {
        replacements: { filtrosSemillero },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    if (semillero.length === 0) {
      return res.status(404).send("No se encontraron autores");
    }
    res.send(semillero);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los autores");
  }
};

export const subtipoproducto = async (req, res) => {
  const productossubtipos = req.query.producto_subtipo;

  if (!Array.isArray(productossubtipos)) {
    return res
      .status(400)
      .send("Los autores deben ser proporcionados como un array");
  }
  const filtrosproducto = productossubtipos.map((autor) => `%${autor}%`);
  try {
    const producto = await sequelize.query(
      `SELECT productos.*, funcionario.*,proyecto.*,semilleros.*,programa.*
      FROM productos
      JOIN funcionario_productos 
      ON productos.producto_id = funcionario_productos.producto_fk
      JOIN funcionario
      ON funcionario.funcionario_id = funcionario_productos.funcionario_fk
      JOIN  semilleros
      ON semilleros.semillero_id = productos.semillero_fk
      JOIN  proyecto
      ON proyecto.proyecto_id = productos.proyecto_fk
      JOIN producto_programa
      ON producto_programa.productos_fk = productos.producto_id
      JOIN programa
      ON programa.programa_id = producto_programa.programa_fk   
	   WHERE productos.producto_subtipo LIKE ANY(ARRAY[:filtrosproducto])`,
      {
        replacements: { filtrosproducto },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (producto.length === 0) {
      return res.status(404).send("No se encontraron productos");
    }

    res.send(producto);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los productos");
  }
};

export const filtroaño = async (req, res) => {
  const buscarano = req.query.productos_ano;
  console.log(buscarano);
  if (!Array.isArray(buscarano)) {
    return res
      .status(400)
      .send("Los anos deben ser proporcionados como un array");
  }
  const filtroanos = buscarano.map((ano) => `%${ano}%`);

  try {
    const producto = await sequelize.query(
      `SELECT productos.*, funcionario.*,proyecto.*,semilleros.*,programa.*
      FROM productos
      JOIN funcionario_productos 
      ON productos.producto_id = funcionario_productos.producto_fk
      JOIN funcionario
      ON funcionario.funcionario_id = funcionario_productos.funcionario_fk
      JOIN  semilleros
      ON semilleros.semillero_id = productos.semillero_fk
      JOIN  proyecto
      ON proyecto.proyecto_id = productos.proyecto_fk
      JOIN producto_programa
      ON producto_programa.productos_fk = productos.producto_id
      JOIN programa
      ON programa.programa_id = producto_programa.programa_fk   
	   WHERE productos.producto_ano LIKE ANY(ARRAY[:filtroanos])`,
      {
        replacements: { filtroanos },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (producto.length === 0) {
      return res.status(404).send("No se encontraron productos");
    }

    res.send(producto);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los productos");
  }
};

export const upload = async (req, res) => {
  readXlsxFile(fs.createReadStream("./excel/input.xls")).then((rows) => {
    console.log(rows);
  });
};

export const filtroproyecto = async (req, res) => {
  const buscarproyecto = req.query.proyectos_nombre;
  console.log(buscarproyecto);
  if (!Array.isArray(buscarproyecto)) {
    return res
      .status(400)
      .send("Los proyectos deben ser proporcionados como un array");
  }
  const filtroproyectos = buscarproyecto.map((ano) => `%${ano}%`);

  try {
    const producto = await sequelize.query(
      `SELECT productos.*, funcionario.*,proyecto.*,semilleros.*,programa.*
      FROM productos
      JOIN funcionario_productos 
      ON productos.producto_id = funcionario_productos.producto_fk
      JOIN funcionario
      ON funcionario.funcionario_id = funcionario_productos.funcionario_fk
      JOIN  semilleros
      ON semilleros.semillero_id = productos.semillero_fk
      JOIN  proyecto
      ON proyecto.proyecto_id = productos.proyecto_fk
      JOIN producto_programa
      ON producto_programa.productos_fk = productos.producto_id
      JOIN programa
      ON programa.programa_id = producto_programa.programa_fk   
	   WHERE proyecto.proyecto_nombre LIKE ANY(ARRAY[:filtroproyectos])`,
      {
        replacements: { filtroproyectos },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (producto.length === 0) {
      return res.status(404).send("No se encontraron productos");
    }

    res.send(producto);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los productos");
  }
};

export const filtroprograma = async (req, res) => {
  const buscarprograma = req.query.programas_nombre;
  console.log(buscarprograma);
  if (!Array.isArray(buscarprograma)) {
    return res
      .status(400)
      .send("Los programas deben ser proporcionados como un array");
  }
  const filtroprogramas = buscarprograma.map((ano) => `%${ano}%`);

  try {
    const producto = await sequelize.query(
      `SELECT productos.*, funcionario.*,proyecto.*,semilleros.*,programa.*
      FROM productos
      JOIN funcionario_productos 
      ON productos.producto_id = funcionario_productos.producto_fk
      JOIN funcionario
      ON funcionario.funcionario_id = funcionario_productos.funcionario_fk
      JOIN  semilleros
      ON semilleros.semillero_id = productos.semillero_fk
      JOIN  proyecto
      ON proyecto.proyecto_id = productos.proyecto_fk
      JOIN producto_programa
      ON producto_programa.productos_fk = productos.producto_id
      JOIN programa
      ON programa.programa_id = producto_programa.programa_fk   
	   WHERE programa.programa_nombre LIKE ANY(ARRAY[:filtroprogramas])`,
      {
        replacements: { filtroprogramas },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (producto.length === 0) {
      return res.status(404).send("No se encontraron productos");
    }

    res.send(producto);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los productos");
  }
};

export const searchProducts = async (req, res, next) => {
  try {
    const query = req.query.titulo;
    console.log(query);

    const productos = await sequelize.query(
      `SELECT productos.*, funcionario.*, proyecto.*, semilleros.*, programa.*
      FROM productos
  
      JOIN (
      SELECT DISTINCT ON (producto_fk) *
      FROM funcionario_productos
      ) AS funcionario_productos
  
  
      ON productos.producto_id = funcionario_productos.producto_fk
      JOIN funcionario
      ON funcionario.funcionario_id = funcionario_productos.funcionario_fk
      JOIN semilleros
      ON semilleros.semillero_id = productos.semillero_fk
      JOIN proyecto
      ON proyecto.proyecto_id = productos.proyecto_fk
  
      JOIN (
        SELECT DISTINCT ON (productos_fk) *
        FROM producto_programa
        ) AS producto_programa
  
  
  
      ON producto_programa.productos_fk = productos.producto_id
      JOIN programa
      ON programa.programa_id = producto_programa.programa_fk
    WHERE LOWER(productos.producto_titulo) LIKE LOWER(:query)`,
      {
        replacements: { query: `%${query}%` },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    // console.log(productos[0].producto_titulo, productos[1].producto_titulo,);
    res.status(200).json({ productos });
  } catch (error) {
    next(error);
  }
};

// creando imagenes

// Controlador para subir una imagen

export const aplicarFiltros = async (req, res) => {
  const semilleroNombre = req.query.semillero_nombre ?? [];
  const productosSubtipos = req.query.producto_subtipo ?? [];
  const buscarAno = req.query.productos_ano ?? [];
  const buscarProyecto = req.query.proyectos_nombre ?? [];
  const buscarPrograma = req.query.programas_nombre ?? [];

  const filtrosSemillero = semilleroNombre.map((nombre) => `%${nombre}%`);
  const filtrosProducto = productosSubtipos.map((subtipo) => `%${subtipo}%`);
  const filtroAnos = buscarAno.map((ano) => `%${ano}%`);
  const filtroProyectos = buscarProyecto.map((proyecto) => `%${proyecto}%`);
  const filtroProgramas = buscarPrograma.map((programa) => `%${programa}%`);

  try {
    // Crea una variable para almacenar las condiciones de filtrado
    let condiciones = [];

    // Crea una variable para almacenar los valores de los filtros
    let valoresFiltros = {};

    // Verificar si se ha seleccionado algún filtro y agregar la condición correspondiente
    if (filtrosSemillero.length > 0) {
      condiciones.push(
        `semilleros.semillero_nombre LIKE ANY(ARRAY[:filtrosSemillero])`
      );
      valoresFiltros.filtrosSemillero = filtrosSemillero;
    }

    if (filtrosProducto.length > 0) {
      condiciones.push(
        `productos.producto_subtipo LIKE ANY(ARRAY[:filtrosProducto])`
      );
      valoresFiltros.filtrosProducto = filtrosProducto;
    }

    if (filtroAnos.length > 0) {
      condiciones.push(`productos.producto_ano LIKE ANY(ARRAY[:filtroAnos])`);
      valoresFiltros.filtroAnos = filtroAnos;
    }

    if (filtroProyectos.length > 0) {
      condiciones.push(
        `proyecto.proyecto_nombre LIKE ANY(ARRAY[:filtroProyectos])`
      );
      valoresFiltros.filtroProyectos = filtroProyectos;
    }

    if (filtroProgramas.length > 0) {
      condiciones.push(
        `programa.programa_nombre LIKE ANY(ARRAY[:filtroProgramas])`
      );
      valoresFiltros.filtroProgramas = filtroProgramas;
    }

    // Crear la consulta SQL base
    let consultaSQL = `SELECT productos.*, funcionario.*, proyecto.*, semilleros.*, programa.*
    FROM productos

    JOIN (
    SELECT DISTINCT ON (producto_fk) *
    FROM funcionario_productos
    ) AS funcionario_productos


    ON productos.producto_id = funcionario_productos.producto_fk
    JOIN funcionario
    ON funcionario.funcionario_id = funcionario_productos.funcionario_fk
    JOIN semilleros
    ON semilleros.semillero_id = productos.semillero_fk
    JOIN proyecto
    ON proyecto.proyecto_id = productos.proyecto_fk

    JOIN (
      SELECT DISTINCT ON (productos_fk) *
      FROM producto_programa
      ) AS producto_programa
    ON producto_programa.productos_fk = productos.producto_id
    JOIN programa
    ON programa.programa_id = producto_programa.programa_fk `;

    // Agregar las condiciones de filtrado a la consulta si existen
    if (condiciones.length > 0) {
      consultaSQL += `WHERE ${condiciones.join(" AND ")}`;
    }

    // Ejecutar la consulta con los filtros correspondientes
    const productos = await sequelize.query(consultaSQL, {
      replacements: valoresFiltros,
      type: sequelize.QueryTypes.SELECT,
    });

    if (productos.length === 0) {
      return res.status(404).send("No se encontraron productos");
    }

    res.status(200).json({ productos });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los productos");
  }
};

export const aplicarFiltrosGraficas = async (req, res) => {

const filtro = req.query.filtroSelect ?? 'producto_tipo'
const semilleroNombre = req.query.semillero_nombre ?? [];
const productosSubtipos = req.query.producto_subtipo ?? [];
const buscarAno = req.query.productos_ano ?? [];
const buscarProyecto = req.query.proyectos_nombre ?? [];
const buscarPrograma = req.query.programas_nombre ?? [];

  const filtrosSemillero = semilleroNombre.map((nombre) => `%${nombre}%`);
  const filtrosProducto = productosSubtipos.map((subtipo) => `%${subtipo}%`);
  const filtroAnos = buscarAno.map((ano) => `%${ano}%`);
  const filtroProyectos = buscarProyecto.map((proyecto) => `%${proyecto}%`);
  const filtroProgramas = buscarPrograma.map((programa) => `%${programa}%`);

  try {
    // Crea una variable para almacenar las condiciones de filtrado
    let condiciones = [];

    // Crea una variable para almacenar los valores de los filtros
    let valoresFiltros = {};

  // Verificar si se ha seleccionado algún filtro y agregar la condición correspondiente
  if (filtrosSemillero.length > 0) {
    condiciones.push(`semilleros.semillero_nombre LIKE ANY(ARRAY[:filtrosSemillero])`);
    valoresFiltros.filtrosSemillero = filtrosSemillero;
  }

  if (filtrosProducto.length > 0) {
    condiciones.push(`productos.producto_subtipo LIKE ANY(ARRAY[:filtrosProducto])`);
    valoresFiltros.filtrosProducto = filtrosProducto;
  }

    if (filtroAnos.length > 0) {
      condiciones.push(`productos.producto_ano LIKE ANY(ARRAY[:filtroAnos])`);
      valoresFiltros.filtroAnos = filtroAnos;
    }

  if (filtroProyectos.length > 0) {
    condiciones.push(`proyecto.proyecto_nombre LIKE ANY(ARRAY[:filtroProyectos])`);
    valoresFiltros.filtroProyectos = filtroProyectos;
  }

  if (filtroProgramas.length > 0) {
    condiciones.push(`programa.programa_nombre LIKE ANY(ARRAY[:filtroProgramas])`);
    valoresFiltros.filtroProgramas = filtroProgramas;
  }

    // Crear la consulta SQL base
    let consultaSQL = `
    SELECT productos.${filtro}, COUNT(*) AS cantidad
    FROM productos
    JOIN (
      SELECT DISTINCT ON (producto_fk) *
      FROM funcionario_productos
    ) AS funcionario_productos
    ON productos.producto_id = funcionario_productos.producto_fk
    JOIN funcionario
    ON funcionario.funcionario_id = funcionario_productos.funcionario_fk
    JOIN semilleros
    ON semilleros.semillero_id = productos.semillero_fk
    JOIN proyecto
    ON proyecto.proyecto_id = productos.proyecto_fk
    JOIN (
      SELECT DISTINCT ON (productos_fk) *
      FROM producto_programa
    ) AS producto_programa
    ON producto_programa.productos_fk = productos.producto_id
    JOIN programa
    ON programa.programa_id = producto_programa.programa_fk`;

  // Agregar las condiciones de filtrado a la consulta si existen
  if (condiciones.length > 0) {
    consultaSQL += ` WHERE ${condiciones.join(' AND ')}`;
  }

    // Agregar la cláusula GROUP BY a la consulta
    consultaSQL += ` GROUP BY productos.${filtro}`;

    // Ejecutar la consulta con los filtros correspondientes
    const productos = await sequelize.query(consultaSQL, {
      replacements: valoresFiltros,
      type: sequelize.QueryTypes.SELECT,
    });

    if (productos.length === 0) {
      return res.status(404).send("No se encontraron productos");
    }

    res.status(200).json({ productos });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los productos");
  }
};
