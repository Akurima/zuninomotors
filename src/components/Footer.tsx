const Footer = () => {
  return (
    <footer className="bg-foreground py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="font-display text-lg tracking-wider text-background/80 mb-2">
          ZUNINO MOTORS
        </p>
        <p className="text-xs text-background/40 font-body">
          © {new Date().getFullYear()} Zunino Motors — Parada Rodó, Canelones, Uruguay
        </p>
      </div>
    </footer>
  );
};

export default Footer;
