// LA LISTA: los viajes del día. Tocar uno abre su detalle; deslizar a la izquierda lo borra; "＋" abre el formulario.
import SwiftUI

struct PantallaLista: View {
    @Environment(Diario.self) private var diario   // el diario compartido, que viene de arriba
    @State private var anotando = false             // ¿está abierto el formulario?

    var body: some View {
        NavigationStack {
            List {
                // El total del día, en una tarjeta del motor.
                if !diario.viajes.isEmpty {
                    VStack(alignment: .leading, spacing: Motor.Espacio.chico) {
                        Text("Hoy").font(Motor.Letra.chica).foregroundStyle(Color.tenue)
                        Text(diario.total.enReales).font(Motor.Letra.total).foregroundStyle(Color.acento)
                        Text(diario.resumen).font(Motor.Letra.chica).foregroundStyle(Color.tenue)
                    }
                    .tarjeta()
                    .listRowInsets(EdgeInsets())
                    .listRowBackground(Color.clear)
                }
                Section {
                    ForEach(diario.viajes) { viaje in            // Identifiable: no hace falta decir cuál es el id
                        NavigationLink(value: viaje) {           // al tocarlo, abre el detalle
                            HStack(spacing: Motor.Espacio.medio) {
                                Circle().fill(Color.deApp(viaje.app)).frame(width: Motor.Forma.punto, height: Motor.Forma.punto)
                                Text(viaje.app).foregroundStyle(Color.texto)
                                Spacer()
                                Text(viaje.valor.enReales).monospacedDigit().foregroundStyle(Color.texto)
                            }
                        }
                        .listRowBackground(Color.tarjeta)
                    }
                    .onDelete { diario.borrar(en: $0) }          // deslizar a la izquierda
                }
            }
            .scrollContentBackground(.hidden)                    // el fondo de la lista lo pone el motor
            .background(Color.fondo)
            .tint(Color.acento)
            .overlay {
                if diario.viajes.isEmpty {
                    ContentUnavailableView("Sin viajes todavía", systemImage: "car",
                                           description: Text("Toca ＋ para anotar el primero."))
                }
            }
            .navigationTitle("Mi jornada")
            .navigationDestination(for: Viaje.self) { PantallaDetalle(viaje: $0) }
            .toolbar {
                Button("Anotar un viaje", systemImage: "plus") { anotando = true }
            }
            .sheet(isPresented: $anotando) { FormularioViaje() }
        }
    }
}

/// El detalle de un viaje. Recibe el viaje: no necesita el diario.
struct PantallaDetalle: View {
    let viaje: Viaje
    var body: some View {
        List {
            LabeledContent("App", value: viaje.app)
            LabeledContent("Valor", value: viaje.valor.enReales)
            LabeledContent("Hora", value: viaje.fecha.formatted(date: .omitted, time: .shortened))
        }
        .navigationTitle(viaje.app)
    }
}

/// El formulario para anotar un viaje, en una hoja que sube desde abajo.
struct FormularioViaje: View {
    @Environment(Diario.self) private var diario
    @Environment(\.dismiss) private var cerrar
    @State private var valor = 18.0
    @State private var app = "Uber"
    let apps = ["Uber", "99", "inDrive"]

    var body: some View {
        NavigationStack {
            Form {
                Picker("App", selection: $app) {
                    ForEach(apps, id: \.self) { Text($0) }
                }
                .pickerStyle(.segmented)
                Stepper("Valor: \(valor.enReales)", value: $valor, in: 0.5...200, step: 0.5)
            }
            .navigationTitle("Nuevo viaje")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) { Button("Cancelar") { cerrar() } }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Guardar") { diario.anotar(valor: valor, app: app); cerrar() }
                }
            }
        }
    }
}

#Preview {
    PantallaLista()
        .environment(Diario(guardado: GuardadoEnMemoria([Viaje(valor: 18, app: "Uber"), Viaje(valor: 25.5, app: "99")])))
}
