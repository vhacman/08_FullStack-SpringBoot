package com.generation.sbb.model;

/**
 * Stato corrente di una camera.
 *
 * Gli stati sono mutuamente esclusivi: una camera è sempre in uno
 * e un solo stato. Per questo motivo si usa un enum e non più boolean
 * separati (es. isOccupied, isDirty): i boolean non impedirebbero
 * combinazioni impossibili come isOccupied=true + isDirty=true.
 *
 * - AVAILABLE:  camera libera e pulita, pronta per nuovi ospiti.
 *               Stato iniziale di ogni camera. Si torna qui dopo le pulizie
 *               (transizione CHECKED_OUT → COMPLETE sulla prenotazione).
 *
 * - OCCUPIED:   c'è un ospite dentro. Si entra qui quando una prenotazione
 *               passa a CHECKED_IN.
 *
 * - TO_CLEAN:   l'ospite è uscito ma la camera non è ancora stata pulita.
 *               Si entra qui quando una prenotazione passa a CHECKED_OUT.
 *               Questa distinzione è utile anche per stanze rimaste vuote
 *               a lungo: si può segnalare TO_CLEAN manualmente per forzare
 *               una pulizia prima di accettare nuovi ospiti.
 *
 * Il campo lastCleaned su Room traccia la data dell'ultima pulizia,
 * indipendentemente dallo status: permette di sapere da quanto tempo
 * una camera non viene pulita anche quando è AVAILABLE.
 */
public enum RoomStatus {
    AVAILABLE,
    OCCUPIED,
    TO_CLEAN
}
