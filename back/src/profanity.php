<?php

class ProfanityFilter {
    private $cache = [];
    private $apiUrl = "https://www.purgomalum.com/service/json";
    private $requestCount = 0;
    private $lastResetTime;

    public function __construct() {
        $this->lastResetTime = time();
    }

    public function checkText($text) {
        // Verificar el caché en memoria
        $textKey = md5($text);
        if (isset($this->cache[$textKey])) {
            echo "Usando caché para el texto\n";
            return $this->cache[$textKey];
        }

        // Verificar límites de rate
        if (!$this->canMakeRequest()) {
            echo "Límite de solicitudes alcanzado, esperando...\n";
            sleep(1);
            return $this->checkText($text);
        }

        try {
            $url = $this->apiUrl . "?" . http_build_query(['text' => $text]);
            $response = @file_get_contents($url);
            
            if ($response === false) {
                throw new Exception("Error al conectar con la API");
            }

            $result = json_decode($response, true);
            $hasProfanity = ($result['result'] !== $text);
            
            // Guardar en caché en memoria
            $this->cache[$textKey] = [
                'hasProfanity' => $hasProfanity,
                'cleanText' => $result['result']
            ];

            $this->requestCount++;
            return $this->cache[$textKey];

        } catch (Exception $e) {
            error_log("Error en ProfanityFilter: " . $e->getMessage());
            return [
                'hasProfanity' => false,
                'cleanText' => $text,
                'error' => $e->getMessage()
            ];
        }
    }

    private function canMakeRequest() {
        $now = time();
        
        // Resetear contador cada minuto
        if ($now - $this->lastResetTime >= 60) {
            $this->requestCount = 0;
            $this->lastResetTime = $now;
        }
        
        return $this->requestCount < 60; // Límite de 60 requests por minuto
    }

    public function getCacheSize() {
        return count($this->cache);
    }

    public function clearCache() {
        $this->cache = [];
    }
}