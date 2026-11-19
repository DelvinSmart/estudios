// EL MOTOR DE DISEÑO: todos los colores, separaciones, formas y letras, en un solo lugar.
// Ninguna pantalla escribe un color o una medida a mano: los "llama" desde aquí (como en todos los cursos).
import SwiftUI

enum Motor {
    /// Separaciones (en puntos: se ven del mismo tamaño en cualquier iPhone).
    enum Espacio {
        static let chico: CGFloat = 8
        static let medio: CGFloat = 14
        static let grande: CGFloat = 20
    }
    enum Forma {
        static let radio: CGFloat = 16
        static let punto: CGFloat = 10   // el puntito de color de cada app (estaba escrito a mano en la lista)
    }
    enum Letra {
        static let total = Font.system(size: 44, weight: .semibold, design: .rounded)
        static let titulo = Font.headline
        static let chica = Font.subheadline
    }
}

// Los colores, cada uno con su versión clara y oscura. El teléfono elige cuál según su modo.
// (También se pueden hacer en el catálogo de Xcode, Assets.xcassets; aquí van en código para leerlos todos juntos.)
extension Color {
    static let fondo = Color(claro: 0xF5F7FA, oscuro: 0x0F141B)
    static let tarjeta = Color(claro: 0xFFFFFF, oscuro: 0x18212C)
    static let texto = Color(claro: 0x1D232B, oscuro: 0xE6EDF3)
    static let tenue = Color(claro: 0x57606A, oscuro: 0x8796AA)
    static let acento = Color(claro: 0x1A7F37, oscuro: 0x7EE787)

    /// El color de cada app, para el puntito de la lista.
    static func deApp(_ app: String) -> Color {
        switch app {
        case "Uber": return Color(claro: 0x000000, oscuro: 0xFFFFFF)
        case "99": return Color(claro: 0xE8B400, oscuro: 0xFFD21F)
        case "inDrive": return Color(claro: 0x5DA312, oscuro: 0xA2E35A)
        default: return .tenue
        }
    }

    /// Un color que cambia solo entre el modo claro y el oscuro del teléfono.
    init(claro: UInt32, oscuro: UInt32) {
        self.init(uiColor: UIColor { rasgos in
            UIColor(hex: rasgos.userInterfaceStyle == .dark ? oscuro : claro)
        })
    }
}

private extension UIColor {
    convenience init(hex: UInt32) {
        self.init(red: CGFloat((hex >> 16) & 0xFF) / 255, green: CGFloat((hex >> 8) & 0xFF) / 255,
                  blue: CGFloat(hex & 0xFF) / 255, alpha: 1)
    }
}

/// Una tarjeta del motor: aire adentro, fondo de tarjeta y esquinas redondeadas. Cada recuadro la "llama" con .tarjeta().
struct Tarjeta: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding(Motor.Espacio.grande)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Color.tarjeta, in: .rect(cornerRadius: Motor.Forma.radio))
    }
}

extension View {
    func tarjeta() -> some View { modifier(Tarjeta()) }
}
