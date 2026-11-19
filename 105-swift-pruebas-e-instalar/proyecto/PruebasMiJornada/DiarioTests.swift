// LAS PRUEBAS DE LA LÓGICA, con Swift Testing (lo nuevo de Apple, que reemplaza a XCTest).
// Corren sin tocar la pantalla y sin el teléfono de verdad: el diario usa un guardado en memoria.
//   En Xcode: ⌘U.   En la terminal: xcodebuild test -scheme MiJornada -destination 'platform=iOS Simulator,name=iPhone 17'
import Foundation
import Testing
@testable import MiJornada   // @testable: deja ver lo que no es público de la app

@Suite("El diario")
struct DiarioTests {
    @Test("anotar suma el total y pone el más nuevo primero")
    func anotar() {
        let diario = Diario(guardado: GuardadoEnMemoria())
        diario.anotar(valor: 18, app: "Uber")
        diario.anotar(valor: 25.5, app: "99")
        #expect(diario.total == 43.5)
        #expect(diario.viajes.map(\.app) == ["99", "Uber"])
    }

    @Test("un valor de 0 o negativo no se anota", arguments: [0.0, -5, -0.01])
    func valoresMalos(valor: Double) {
        let diario = Diario(guardado: GuardadoEnMemoria())
        diario.anotar(valor: valor, app: "Uber")
        #expect(diario.viajes.isEmpty)
    }

    @Test("cada cambio queda guardado")
    func guarda() {
        let guardado = GuardadoEnMemoria()
        let diario = Diario(guardado: guardado)
        diario.anotar(valor: 18, app: "Uber")
        diario.borrar(en: IndexSet([0]))
        diario.anotar(valor: 30, app: "inDrive")
        #expect(guardado.guardados.map(\.valor) == [30])
    }

    @Test("al abrir, lee lo que estaba guardado")
    func leeAlAbrir() {
        let guardado = GuardadoEnMemoria([Viaje(valor: 12.5, app: "99")])
        let diario = Diario(guardado: guardado)
        #expect(diario.total == 12.5)
    }

    @Test("borrar dos posiciones separadas borra los correctos")
    func borrarVarios() {
        let diario = Diario(guardado: GuardadoEnMemoria())
        for (v, app) in [(10.0, "a"), (20.0, "b"), (30.0, "c"), (40.0, "d")] { diario.anotar(valor: v, app: app) }
        // la lista queda d, c, b, a (el más nuevo primero)
        diario.borrar(en: IndexSet([0, 2]))
        #expect(diario.viajes.map(\.app) == ["c", "a"])
    }
}

@Suite("Lo que se encontró mirando la app")
struct TextosTests {
    @Test("singular y plural (clase 102: decía \"1 viajes\")", arguments: [
        (1, "1 viaje · promedio"),
        (2, "2 viajes · promedio"),
    ])
    func plural(cantidad: Int, empieza: String) {
        let diario = Diario(guardado: GuardadoEnMemoria())
        for _ in 0..<cantidad { diario.anotar(valor: 10, app: "Uber") }
        #expect(diario.resumen.hasPrefix(empieza))
    }

    @Test("la línea chica muestra el promedio, no el total (clase 104)")
    func promedioNoTotal() {
        let diario = Diario(guardado: GuardadoEnMemoria())
        for v in [23.5, 18, 31, 12.5] { diario.anotar(valor: v, app: "Uber") }
        #expect(diario.resumen.contains("21,25"))
        #expect(!diario.resumen.contains("85"))
    }

    @Test("sin viajes")
    func vacio() {
        #expect(Diario(guardado: GuardadoEnMemoria()).resumen == "Sin viajes todavía")
    }
}

@Suite("Guardar en el teléfono")
struct GuardadoTests {
    @Test("lo guardado roto no cierra la app: se empieza vacío")
    func roto() {
        let clave = "viajes:v1"
        let antes = UserDefaults.standard.data(forKey: clave)
        defer { UserDefaults.standard.set(antes, forKey: clave) }   // dejar todo como estaba
        UserDefaults.standard.set(Data("esto no es JSON".utf8), forKey: clave)
        #expect(GuardadoEnElTelefono().leer().isEmpty)
    }

    @Test("ida y vuelta por el teléfono")
    func idaYVuelta() {
        let clave = "viajes:v1"
        let antes = UserDefaults.standard.data(forKey: clave)
        defer { UserDefaults.standard.set(antes, forKey: clave) }
        let viajes = [Viaje(valor: 18, app: "Uber"), Viaje(valor: 25.5, app: "99")]
        GuardadoEnElTelefono().guardar(viajes)
        #expect(GuardadoEnElTelefono().leer() == viajes)
    }
}
