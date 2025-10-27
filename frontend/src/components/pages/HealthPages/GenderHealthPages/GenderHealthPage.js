import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import CustomDatePicker from "../../../elements/Health/FemaleHealth/CustomDatePicker/CustomDatePicker";
import FemaleCustomSelect from "../../../elements/Health/FemaleHealth/CustomSelector/FemaleCustomSelect";
import FemaleNomiWithEllipse from "../../../../assets/your-health-img/FemaleNomiWithEllipse.png"
import MaleNomiWithEllipse from "../../../../assets/your-health-img/MaleNomiWithEllipse.png"

import '../../../styles/gender.css'

const GenderHealthPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    return(
        <div className="gender-health-selector">
            <div className="gender-option" onClick={() => navigate(`${location.pathname}/female`)}>
                <div>
                    <h3>{t("female")}</h3>
                    {/* <img  /> */}
                    <div className="img-but-div">
                        <img src={FemaleNomiWithEllipse} alt="FNomi" className="ghs-img-fnomi" />
                    </div>
                </div>
            </div>
            <div className="gender-option" onClick={() => navigate(`${location.pathname}/male`)}>
                <div>
                    <h3>{t("male")}</h3>
                    <div className="img-but-div">
                        <img src={MaleNomiWithEllipse} alt="MNomi" className="ghs-img-mnomi" />
                    </div>
                </div>
            </div>
        </div>  
    );
}

export default GenderHealthPage;