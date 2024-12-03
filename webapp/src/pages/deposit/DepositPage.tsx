import { useContext } from "react";
import { UserContext, UserContextParams } from "../../App";
import "./DepositPage.css";
import { ServerConnection } from "../../libs/ServerConnection";
import { UserData } from "../../libs/UserData";

function DepositButton(props: { amount: number }): JSX.Element {
  const context = useContext<UserContextParams>(UserContext);
  if (context.token == null || context.userData == null) {
    return <></>;
  }

  return (
    <>
      <div
        className="deposit"
        onClick={async () => {
          const res = await ServerConnection.addBalance({
            token: context.token as string,
            amount: props.amount,
          });
          if (res.success) {
            context.updateUserData();
          }
        }}
      >
        <h1>Wpłać {props.amount} PLN</h1>
      </div>
    </>
  );
}
export function DepositPage(): JSX.Element {
  return (
    <div id="depositpage">
      <DepositButton amount={5.0} />
      <DepositButton amount={10.0} />
      <DepositButton amount={20.0} />
      <DepositButton amount={50.0} />
      <DepositButton amount={100.0} />
      <DepositButton amount={200.0} />
    </div>
  );
}
