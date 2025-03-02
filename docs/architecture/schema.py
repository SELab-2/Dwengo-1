from diagrams import Cluster, Diagram
from diagrams.custom import Custom
from diagrams.onprem.certificates import LetsEncrypt
from diagrams.onprem.container import Docker
from diagrams.onprem.database import PostgreSQL
from diagrams.onprem.logging import Loki
from diagrams.onprem.monitoring import Grafana
from diagrams.onprem.network import Nginx
from diagrams.programming.framework import Vue
from diagrams.programming.language import Nodejs
from diagrams.programming.flowchart import InputOutput

with Diagram("Dwengo-1 architectuur", filename="docs/architecture/schema", show=False):
    reverse_proxy = Nginx("reverse proxy")
    reverse_proxy >> LetsEncrypt("SSL")

    with Cluster("Docker"):
        Docker()

        frontend = Vue("/")
        backend = Nodejs("/api")
        reverse_proxy >> frontend
        frontend >> backend >> InputOutput("MikroORM") >> PostgreSQL()

        backend >> Loki("logging") >> Grafana("monitoring")

    with Cluster("Dwengo"):
        dwengo = Custom("Dwengo", "../../assets/img/dwengo-groen-zwart.png")

    backend >> dwengo
