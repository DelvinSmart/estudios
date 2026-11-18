// EL HOOK: junta el estado de la lista con el repositorio. La pantalla solo lo usa:
//   const { gastos, cargando, aviso, agregarGasto, borrarGasto } = useGastos(repositorio);
import { useCallback, useEffect, useRef, useState } from 'react';
import { agregar, quitar, type Gasto } from '../logica/gastos';
import type { Repositorio } from '../datos/repositorio';

export function useGastos(repositorio: Repositorio) {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [aviso, setAviso] = useState<string | null>(null);
  // La última lista que está en el teléfono: para no guardar lo que se acaba de leer.
  const enElTelefono = useRef<Gasto[] | null>(null);

  // 1. Al aparecer: leer lo guardado (una vez por repositorio), con limpieza (clase 55).
  useEffect(() => {
    let activo = true;
    repositorio
      .leer()
      .then((lista) => {
        if (!activo) return;
        enElTelefono.current = lista;
        setGastos(lista);
      })
      .catch(() => activo && setAviso('No pude leer los gastos guardados'))
      .finally(() => activo && setCargando(false));
    return () => {
      activo = false;
    };
  }, [repositorio]);

  // 2. Cada vez que la lista cambia (después de leer), se guarda.
  useEffect(() => {
    if (enElTelefono.current === null || enElTelefono.current === gastos) return;
    enElTelefono.current = gastos;
    repositorio.guardar(gastos).catch(() => setAviso('No se pudo guardar en el teléfono'));
  }, [gastos, repositorio]);

  // 3. Los cambios usan el valor anterior (la forma segura) y useCallback, para no romper el memo de las tarjetas.
  const agregarGasto = useCallback((gasto: Gasto) => setGastos((antes) => agregar(antes, gasto)), []);
  const borrarGasto = useCallback((id: string) => setGastos((antes) => quitar(antes, id)), []);

  return { gastos, cargando, aviso, agregarGasto, borrarGasto };
}
