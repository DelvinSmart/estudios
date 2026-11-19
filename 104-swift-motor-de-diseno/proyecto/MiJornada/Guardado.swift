// DÓNDE SE GUARDAN LOS VIAJES: un protocolo (clase 100) y dos formas de cumplirlo.
// El diario no sabe si guarda en el teléfono o en la memoria: así se puede probar sin teléfono.
import Foundation

protocol Guardado {
    func leer() -> [Viaje]
    func guardar(_ viajes: [Viaje])
}

/// En el teléfono: UserDefaults, con los viajes como JSON. La clave tiene versión, por si un día cambia la forma.
struct GuardadoEnElTelefono: Guardado {
    let clave = "viajes:v1"

    func leer() -> [Viaje] {
        guard let datos = UserDefaults.standard.data(forKey: clave),
              let viajes = try? JSONDecoder().decode([Viaje].self, from: datos)
        else { return [] }   // nada guardado, o guardado roto: se empieza vacío, no se cierra la app
        return viajes
    }

    func guardar(_ viajes: [Viaje]) {
        if let datos = try? JSONEncoder().encode(viajes) {
            UserDefaults.standard.set(datos, forKey: clave)
        }
    }
}

/// En la memoria: para las pruebas y para la vista previa.
final class GuardadoEnMemoria: Guardado {
    private(set) var guardados: [Viaje]
    init(_ viajes: [Viaje] = []) { guardados = viajes }
    func leer() -> [Viaje] { guardados }
    func guardar(_ viajes: [Viaje]) { guardados = viajes }
}
