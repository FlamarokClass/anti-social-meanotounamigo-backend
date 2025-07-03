const seisMesesAtras = () => {
  const fecha = new Date();
  fecha.setMonth(fecha.getMonth() - 6);
  return fecha;
};

module.exports = { seisMesesAtras };