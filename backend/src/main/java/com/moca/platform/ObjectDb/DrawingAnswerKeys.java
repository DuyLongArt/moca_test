package com.moca.platform.ObjectDb;

import java.util.List;

/** Keys in {@code raw_answers} that hold canvas PNG data URLs (Section 1). */
public final class DrawingAnswerKeys {

    public static final List<String> CANVAS_KEYS = List.of(
            "section_1a_trail_canvas",
            "section_1b_cube_canvas",
            "section_1c_clock_canvas"
    );

    private DrawingAnswerKeys() {
    }
}
