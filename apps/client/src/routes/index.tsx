import { createFileRoute } from "@tanstack/react-router";
import "../index.css";
import Button from "../components/Button/Button";
import { GiMusicalNotes } from "react-icons/gi";
import { GiSaxophone } from "react-icons/gi";
import { useAuth } from "../context/AuthContext";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isLoggedIn } = useAuth();
  return (
    <main>
      {isLoggedIn ? (
        <section className="hero">
          <div className="heading-container">
            <h1>Welcome, name</h1>
            <div className="buttons">
              <Button text="Opret ensemble" color="white" link="/create-ensemble" />
              <Button text="Færdiggør profil" color="blue" link="/profile" />
            </div>
          </div>
          <div className="welcome-img">
            <img src="/profile-welcome.svg" alt="welcome-illustration" />
          </div>
        </section>
      ) : (
        <>
          <section className="hero">
            <div className="heading-container">
              <h1 className="heading">
                Stedet hvor amatørmusikere finder hinanden og spiller musik
                sammen
              </h1>
              <div className="buttons">
                <Button
                  text="Find musiker"
                  color="white"
                  link="/"
                  children={<GiMusicalNotes className="icon" />}
                />
                <Button
                  text="Find ensembler"
                  color="white"
                  link="/"
                  children={<GiSaxophone className="icon" />}
                />
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
                    meningen, at vi bare skulle mødes en enkelt gang, men det
                    var bare så fedt, at nu mødes vi hver anden uge!
                  </p>
                  <div className="img-container">
                    <img src="/profile1.jpg" alt="profile-foto" />
                  </div>
                  <p className="name">Sofie</p>
                  <p>Fra kvartetten Klassisk Amok</p>
                </div>
                <div className="review">
                  <p>
                    Vi stod over for at mangle både en trompetist og en
                    fløjtenist til vores nytårskoncert - men med Musik Samspil
                    fandt vi assistenter i løbet af få timer. Noget der ellers
                    kan holde mig søvnløs i flere nætter!
                  </p>
                  <div className="img-container">
                    <img src="/profile2.jpg" alt="profile-foto" />
                  </div>
                  <p className="name">Anitta</p>
                  <p>Koordinator i VirumOrkestret</p>
                </div>
                <div className="review">
                  <p>
                    Musik Samspil hjalp os med at finde sammen. Først var det
                    meningen, at vi bare skulle mødes en enkelt gang, men det
                    var bare så fedt, at nu mødes vi hver anden uge!
                  </p>
                  <div className="img-container">
                    <img src="/profile3.jpg" alt="profile-foto" />
                  </div>
                  <p className="name">Amalie</p>
                  <p>Fra kvartetten HudestedOrkestret</p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
