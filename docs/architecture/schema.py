from diagrams import Cluster, Diagram, Edge
from diagrams.custom import Custom
from diagrams.onprem.certificates import LetsEncrypt
from diagrams.onprem.database import PostgreSQL
from diagrams.onprem.logging import Loki
from diagrams.onprem.monitoring import Grafana
from diagrams.onprem.network import Nginx
from diagrams.programming.flowchart import InputOutput
from diagrams.programming.framework import Vue
from diagrams.programming.language import Nodejs

with Diagram("Dwengo-1 architectuur", filename="docs/architecture/schema", show=False):
    ingress = Nginx("Reverse Proxy")
    certificates = LetsEncrypt("SSL")

    with Cluster("Dwengo VZW"):
        dwengo = Custom("Dwengo", "../../assets/img/dwengo-groen-zwart.png")

    with Cluster("Dwengo-1"):
        frontend = Vue("/")
        backend = Nodejs("/api")
        identity_provider = Custom("IDP", "../../assets/img/keycloak.png")

        database = PostgreSQL("Database")
        orm = InputOutput("MikroORM")
        orm >> Edge(label="map") << database

        with Cluster("Observability"):
            logging = Loki("Logging")
            logging << Edge(color="firebrick", style="dashed") << Grafana("Monitoring")

        dependencies = [
            dwengo,
            logging,
            orm
        ]

        backend >> dependencies

    service = [
        frontend,
        backend,
        identity_provider,
        certificates
    ]

    ingress \
    >> Edge(color="darkgreen") \
    << service
