// LA PANTALLA: el visor y el teclado. Dibuja lo que dice el estado; no hace ninguna cuenta.
import SwiftUI

struct PantallaCalculadora: View {
    @State private var estado = Estado()

    var body: some View {
        GeometryReader { geo in            // el ancho de la pantalla: lo que en RN daba useWindowDimensions
            let lado = Motor.ladoDeTecla(ancho: geo.size.width)
            VStack(spacing: Motor.Espacio.medio) {
                Spacer()
                Visor(texto: estado.error ?? formatear(estado.pantalla), esAviso: estado.error != nil)
                ForEach(filas, id: \.self) { fila in
                    HStack(spacing: Motor.Espacio.medio) {
                        ForEach(fila, id: \.self) { t in
                            TeclaRedonda(tecla: t, lado: lado, encendida: t == operadorEncendido(estado).map(Tecla.operador)) {
                                estado = apretar(estado, t)   // la lógica dice qué pasa; la pantalla solo guarda el resultado
                            }
                        }
                    }
                }
            }
            .padding(Motor.Espacio.grande)
            .frame(maxWidth: Motor.Forma.anchoMaximo)
            .frame(maxWidth: .infinity)
        }
        .background(Color.fondo)
    }
}

struct Visor: View {
    let texto: String
    let esAviso: Bool
    var body: some View {
        Text(texto)
            .font(esAviso ? Motor.Letra.aviso : Motor.Letra.visor)
            .foregroundStyle(esAviso ? Color.tenue : Color.visor)
            .lineLimit(1)
            .minimumScaleFactor(Motor.Letra.visorMinimo)   // en SwiftUI, achicar para que entre funciona de fábrica
            .frame(maxWidth: .infinity, alignment: .trailing)
            .accessibilityAddTraits(.updatesFrequently)
    }
}

struct TeclaRedonda: View {
    let tecla: Tecla
    let lado: CGFloat
    let encendida: Bool
    let alTocar: () -> Void

    var body: some View {
        let t = tipo(de: tecla)
        let esOperador = t == .operador || t == .igual
        // Encendida: los colores al revés, para que se vea qué operador se eligió.
        let fondo: Color = encendida ? .sobreOperador : esOperador ? .operador : t == .funcion ? .funcion : .numero
        let letra: Color = encendida ? .operador : esOperador ? .sobreOperador : t == .funcion ? .sobreFuncion : .sobreNumero
        Button(action: alTocar) {
            Text(tecla.simbolo)
                .font(Motor.Letra.tecla)
                .foregroundStyle(letra)
                .frame(width: lado, height: lado)
                .background(fondo, in: .circle)
        }
        .buttonStyle(.plain)
        .accessibilityLabel(etiqueta(de: tecla))           // VoiceOver dice "dividir", no "÷"
        .accessibilityAddTraits(encendida ? .isSelected : [])
    }
}

#Preview { PantallaCalculadora() }
