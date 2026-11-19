// EL MOTOR DE DISEÑO: los mismos valores que la calculadora de React Native (clase 94) y la de Kotlin (clase 96).
import SwiftUI

enum Motor {
    enum Espacio { static let medio: CGFloat = 14; static let grande: CGFloat = 20 }
    enum Forma { static let anchoMaximo: CGFloat = 420 }   // en un iPad, la calculadora no se estira
    enum Letra {
        static let tecla = Font.system(size: 30, weight: .semibold)
        static let visor = Font.system(size: 72, weight: .light)
        static let aviso = Font.system(size: 22)
        static let visorMinimo: CGFloat = 0.4   // el visor puede achicarse hasta el 40% para que el número entre
    }

    /// El lado de cada tecla: cuatro por fila con sus tres huecos.
    static func ladoDeTecla(ancho: CGFloat) -> CGFloat {
        let util = min(ancho, Forma.anchoMaximo) - Espacio.grande * 2
        return ((util - Espacio.medio * 3) / 4).rounded(.down)
    }
}

extension Color {
    static let fondo = Color(claro: 0xF5F7FA, oscuro: 0x0F141B)
    static let visor = Color(claro: 0x1D232B, oscuro: 0xE6EDF3)
    static let tenue = Color(claro: 0x57606A, oscuro: 0x8796AA)
    static let numero = Color(claro: 0xFFFFFF, oscuro: 0x18212C)
    static let sobreNumero = Color(claro: 0x1D232B, oscuro: 0xE6EDF3)
    static let funcion = Color(claro: 0xD8DEE4, oscuro: 0x2B3644)
    static let sobreFuncion = Color(claro: 0x1D232B, oscuro: 0xE6EDF3)
    static let operador = Color(claro: 0x1A7F37, oscuro: 0x7EE787)
    static let sobreOperador = Color(claro: 0xFFFFFF, oscuro: 0x0F141B)

    init(claro: UInt32, oscuro: UInt32) {
        self.init(uiColor: UIColor { $0.userInterfaceStyle == .dark ? UIColor(hex: oscuro) : UIColor(hex: claro) })
    }
}

private extension UIColor {
    convenience init(hex: UInt32) {
        self.init(red: CGFloat((hex >> 16) & 0xFF) / 255, green: CGFloat((hex >> 8) & 0xFF) / 255,
                  blue: CGFloat(hex & 0xFF) / 255, alpha: 1)
    }
}
