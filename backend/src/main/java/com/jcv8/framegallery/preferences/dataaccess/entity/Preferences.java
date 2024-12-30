package com.jcv8.framegallery.preferences.dataaccess.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@Entity
@Data
@NoArgsConstructor
public class Preferences {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ElementCollection
    @Column(length = 2048)
    private Map<String, String> preferences;

    @ElementCollection
    @Column(length = 2048)
    public static final Map<String, String> defaultPreferences = new HashMap<>(
            Map.of(
                    "darkmode", "false",
                    "locale", "en_EN",
                    "title-quotes", "true",
                    "accent-border", "true",
                    "font-size-title", "1.75rem",
                    "font-size-text", "1.2rem",
                    "font-size-tags", "1rem",
                    "tracking-code", "  var _paq = window._paq = window._paq || [];\n" +
                            "  _paq.push(['trackPageView']);\n" +
                            "  _paq.push(['enableLinkTracking']);\n" +
                            "  (function() {\n" +
                            "    var u=\"https://analytics.yourdomain.com/\";\n" +
                            "    _paq.push(['setTrackerUrl', u+'matomo.php']);\n" +
                            "    _paq.push(['setSiteId', '0']);\n" +
                            "    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];\n" +
                            "    g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);\n" +
                            "  })();"
            )
    );
    public Preferences(Map<String, String> preferences) {
        this.preferences = preferences;
    }

}
