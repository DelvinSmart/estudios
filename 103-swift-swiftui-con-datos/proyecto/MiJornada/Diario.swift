// EL DIARIO: los viajes de la app, compartidos por todas las pantallas.
// Es una class (clase 100): se comparte, no se copia. @Observable: cuando cambia, las pantallas que lo leen se dibujan de nuevo.
import Foundation
import Observation

@Observable
final class Diario {
    private(set) var viajes: [Viaje]
    private let guardado: Guardado

    init(guardado: Guardado) {
        self.guardado = guardado
        viajes = guardado.leer()
    }

    var total: Double { viajes.reduce(0) { $0 + $1.valor } }

    var resumen: String {
        switch viajes.count {
        case 0: return "Sin viajes todavía"
        case 1: return "1 viaje · \(total.enReales)"
        default: return "\(viajes.count) viajes · \(total.enReales)"
        }
    }

    /// Anota un viaje arriba de todo (el más nuevo primero). Un valor de 0 o negativo no se anota.
    func anotar(valor: Double, app: String) {
        guard valor > 0 else { return }
        viajes.insert(Viaje(valor: valor, app: app), at: 0)
        guardado.guardar(viajes)
    }

    /// Borra los viajes de esas posiciones (lo que manda la lista al deslizar el dedo).
    func borrar(en posiciones: IndexSet) {
        viajes.remove(atOffsets: posiciones)
        guardado.guardar(viajes)
    }
}
