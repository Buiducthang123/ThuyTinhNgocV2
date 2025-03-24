export interface IWard {
    WardCode: string;
    DistrictID: number;
    WardName: string;
    NameExtension: string[];
    IsEnable: number;
    CanUpdateCOD: boolean;
    UpdatedBy: number;
    CreatedAt: string;
    UpdatedAt: string;
    SupportType: number;
    PickType: number;
    DeliverType: number;
    // WhiteListClient: {
    //     From: any[];
    //     To: any[];
    //     Return: any[];
    // };
    // WhiteListWard: {
    //     From: any | null;
    //     To: any | null;
    // };
    // Status: number;
    // ReasonCode: string;
    // ReasonMessage: string;
    // OnDates: string[];
    // UpdatedEmployee: number;
    // UpdatedDate: string;
}