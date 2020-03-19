// TypeScript file
class Item{
    private ecg:egret.Shape
    private bmpSnap:egret.Bitmap
    private rectClip:egret.Rectangle

    constructor(ecg:egret.Shape,bmpSnap:egret.Bitmap,rectClip:egret.Rectangle){
        this.ecg = ecg
        this.bmpSnap = bmpSnap
        this.rectClip = rectClip
    }

    public getEcg(){
        return this.ecg;
    }

    public getBmpSnap(){
        return this.bmpSnap;
    }

    public getRectClip(){
        return this.rectClip
    }

}