package project.kombat.model.MinionAndStrategyHierarchy;


import project.kombat.model.GameManagement.Minion;

public class ShadowWarden extends Minion {

    public ShadowWarden(String PlayerName,int minionMaxHP) {
        super(PlayerName,minionMaxHP,30,10,2);
    }

    @Override
    public int minionAttack(){
        return 2;
    }


}
