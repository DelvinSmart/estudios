// LA LÓGICA: lo que pasó en el día. Swift puro, sin pantalla: se puede probar sola (clase 105).
// Es un struct: un valor que se copia (clase 100). Cada cambio es "mutating".
import Foundation // para el formato de los reales (Locale)

struct Jornada {
    private(set) var viajes: [Double] = []   // lo que pagó cada viaje; desde afuera se lee, no se cambia

    var total: Double { viajes.reduce(0, +) }
    var promedio: Double { viajes.isEmpty ? 0 : total / Double(viajes.count) }

    /// "1 viaje · promedio R$ 18,00". Encontrado mirando la app en el simulador: decía "1 viajes".
    var resumen: String {
        let cuantos = viajes.count == 1 ? "1 viaje" : "\(viajes.count) viajes"
        return "\(cuantos) · promedio \(promedio.enReales)"
    }

    /// Anota un viaje. Un valor de 0 o negativo no se anota.
    mutating func anotar(_ valor: Double) {
        guard valor > 0 else { return }
        viajes.append(valor)
    }

    /// Borra el último viaje (por si te equivocaste).
    mutating func deshacer() {
        _ = viajes.popLast()
    }
}

extension Double {
    /// 18.5 → "R$ 18,50", como en Brasil.
    var enReales: String { formatted(.currency(code: "BRL").locale(Locale(identifier: "pt_BR"))) }
}
