import { createFileRoute } from "@tanstack/react-router";
import "../index.css";
import Button from "../components/Button/Button";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main>
      <section className="hero">
        <div>
          <h1 className="heading">
            Stedet hvor amatørmusikere finder hinanden og spiller musik sammen
          </h1>
          <div className="buttons">
            <Button text="Find musiker" color="white" link="/" />
            <Button text="Find ensembler" color="white" link="/" />
          </div>
        </div>

        <div className="img">
          <img src="/hero-illustration@2x.png" alt="hero-illustration" />
        </div>
      </section>
      <section className="reviews">
        <div className="content">
          <h2>Det siger vores brugere</h2>
          <div className="reviews-container">
            <div className="review">
              <p>
                Musik Samspil hjalp os med at finde sammen. Først var det
                meningen, at vi bare skulle mødes en enkelt gang, men det var
                bare så fedt, at nu mødes vi hver anden uge!
              </p>
              <p>Sofie</p>
              <p>title</p>
            </div>
            <div className="review">
              <p>
                “Vi stod over for at mangle både en trompetist og en fløjtenist
                til vores nytårskoncert - men med Musik Samspil fandt vi
                assistenter i løbet af få timer. Noget der ellers kan holde mig
                søvnløs i flere nætter!
              </p>
              <p>Sofie</p>
              <p>title</p>
            </div>
            <div className="review">
              <p>
                Musik Samspil hjalp os med at finde sammen. Først var det
                meningen, at vi bare skulle mødes en enkelt gang, men det var
                bare så fedt, at nu mødes vi hver anden uge!
              </p>
              <p>Sofie</p>
              <p>title</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
