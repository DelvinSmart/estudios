// UN VIAJE: los datos de cada viaje. Swift puro.
// Identifiable: tiene un id único (la lista lo usa para saber cuál es cuál, como la key de React).
// Codable: se puede convertir a JSON y de vuelta (así se guarda en el teléfono).
import Foundation

struct Viaje: Identifiable, Codable, Hashable {   // Hashable: lo pide NavigationLink(value:) (lo dijo el compilador)
    var id = UUID()
    var valor: Double
    var app: String
    var fecha = Date()
}

extension Double {
    /// 18.5 → "R$ 18,50", como en Brasil.
    var enReales: String { formatted(.currency(code: "BRL").locale(Locale(identifier: "pt_BR"))) }
}
