type Starters = "Treecko" | "Torchic" | "Mudkip";
type Rival = "May" | "Brendan";
type RivalBattleProps = {
  parties: Record<Starters, any[]>;
};
const RivalBattle = () => {
  return (
    <div className="rival-battle">
      <h2>Rival Battle</h2>
      <p>Prepare for a challenging battle against your rival!</p>
      <ul>
        <li>Location: Route 22</li>
        <li>Level: 15-20</li>
        <li>Type: Mixed</li>
      </ul>
    </div>
  );
};
