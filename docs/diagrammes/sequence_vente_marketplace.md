# Diagramme de séquence : Achat Marketplace & Gestion des Stocks

Ce diagramme illustre le processus d'achat d'une culture sur le Marketplace, en incluant la vérification critique de la disponibilité en stock (bloc "alt").
```plantuml
@startuml
skinparam style strictuml
actor "Acheteur / Client" as User
boundary "Marketplace UI" as Frontend
control "VenteController" as Controller
entity "StockService" as Service
database "MariaDB" as DB

User -> Frontend : 1. Clique sur "Acheter" (ID Offre, Quantité)
Frontend -> Controller : 2. POST /api/ventes {offre_id, qte}
Controller -> Controller : 3. Vérification Auth/Rôle
Controller -> Service : 4. traiterAchat(offre_id, qte)
Service -> DB : 5. SELECT qte_disponible FROM stocks
DB --> Service : 6. Retourne qte_disponible

alt qte_disponible < qte_demandée
    Service --> Controller : 7a. Exception (Stock insuffisant)
    Controller --> Frontend : 8a. Erreur 400 (Bad Request)
    Frontend --> User : 9a. Affiche message "Stock insuffisant"
else qte_disponible >= qte_demandée
    Service -> DB : 7b. UPDATE stocks SET qte = qte - qte_demandée
    Service -> DB : 8b. INSERT INTO ventes (détails)
    DB --> Service : 9b. Confirmation
    Service --> Controller : 10b. Retourne Succès & Facture
    Controller --> Frontend : 11b. HTTP 201 Created
    Frontend --> User : 12b. Affiche confirmation d'achat
end
@enduml
```
