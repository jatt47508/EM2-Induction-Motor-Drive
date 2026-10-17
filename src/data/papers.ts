export type Paper = {
  id: number
  title: string
  authors: string
  year: number | string
  area: 'Dynamic Modelling' | 'Parameter Estimation' | 'Torque and Speed Control' | 'Sensorless Control' | 'Intelligent Control' | string
  contribution: string
  link?: string
  doi?: string
}

export const papers: Paper[] = [
  {
    id: 1,
    title: 'Three Phase Induction Motor Drive: A Systematic Review on Dynamic Modeling, Parameter Estimation, and Control Schemes',
    authors: 'U. Sengamalai et al.',
    year: 2022,
    area: 'Dynamic Modelling',
    contribution: 'Systematic review covering the connection between dynamic modelling, parameter estimation, and control techniques, and how motor parameters affect control performance.',
    link: 'https://www.mdpi.com/1996-1073/15/21/8260'
  },
  {
    id: 2,
    title: 'Parameter Identification of Inverter-Fed Induction Motors: A Review',
    authors: 'J. Tang et al.',
    year: 2018,
    area: 'Parameter Estimation',
    contribution: 'Reviews parameter identification methods for inverter-fed induction motors, addressing practical challenges and accuracy under real operating conditions.',
    link: 'https://www.mdpi.com/1996-1073/11/9/2194'
  },
  {
    id: 3,
    title: 'A New Quick-Response and High-Efficiency Control Strategy of an Induction Motor',
    authors: 'I. Takahashi and T. Noguchi',
    year: 1986,
    area: 'Torque and Speed Control',
    contribution: 'Introduced a fast-response, high-efficiency control method that became an important basis for Direct Torque Control, controlling torque and flux with quick response.',
    link: 'https://doi.org/10.1109/TIA.1986.4504799',
    doi: 'https://doi.org/10.1109/TIA.1986.4504799'
  },
  {
    id: 4,
    title: 'Direct Self-Control (DSC) of Inverter-Fed Induction Machine',
    authors: 'M. Depenbrock',
    year: 1988,
    area: 'Torque and Speed Control',
    contribution: 'Presented a direct self-control method using inverter switching to control motor operation, contributing to the development of direct control techniques for AC drives.',
    link: 'https://doi.org/10.1109/63.17963',
    doi: 'https://doi.org/10.1109/63.17963'
  },
  {
    id: 5,
    title: 'A Review on MRAS-Type Speed Estimators for Reliable and Efficient Induction Motor Drives',
    authors: 'M. Korzonek, G. Tarchala, and T. Orlowska-Kowalska',
    year: 2019,
    area: 'Sensorless Control',
    contribution: 'Reviews Model Reference Adaptive System (MRAS) methods for estimating motor speed without a physical speed sensor, including the challenges affecting estimation accuracy.',
    link: 'https://pubmed.ncbi.nlm.nih.gov/30987804/'
  },
  {
    id: 6,
    title: 'Multi-Rate Real-Time Model-Based Parameter Estimation and State Identification for Induction Motors',
    authors: 'S. Wang, V. Dinavahi, and J. Xiao',
    year: 2013,
    area: 'Parameter Estimation',
    contribution: 'Studies methods to estimate motor parameters and load torque while the motor is running, helping track changing motor conditions to improve control performance.',
    link: 'https://doi.org/10.1049/iet-epa.2012.0116',
    doi: 'https://doi.org/10.1049/iet-epa.2012.0116'
  },
  {
    id: 7,
    title: 'A Review of Parameter Estimators and Controllers for Induction Motors Based on Artificial Neural Networks',
    authors: 'J. M. Gutiérrez-Villalobos et al.',
    year: 2013,
    area: 'Intelligent Control',
    contribution: 'Reviews ANN-based methods for estimating motor parameters and controlling induction motors, offering a data-driven alternative to conventional mathematical methods.',
    link: 'https://www.sciencedirect.com/science/article/abs/pii/S0925231213002105'
  },
  {
    id: 8,
    title: 'Review of Speed Estimation Algorithms for Three-Phase Induction Motor',
    authors: 'Z. M. S. Elbarbary et al.',
    year: 2024,
    area: 'Sensorless Control',
    contribution: 'Compares sensorless speed estimation methods based on accuracy, low-speed performance, and computational complexity.',
    link: 'https://doi.org/10.1016/j.mex.2024.102546',
    doi: 'https://doi.org/10.1016/j.mex.2024.102546'
  },
  {
    id: 9,
    title: 'Parameter Adaptation for the Speed-Controlled Static AC Drive with a Squirrel-Cage Induction Motor',
    authors: 'L. J. Garces',
    year: 1980,
    area: 'Parameter Estimation',
    contribution: 'Explains how changes in rotor resistance affect speed-controlled induction motors and why motor parameters may need to be adjusted during operation.',
    link: 'https://doi.org/10.1109/TIA.1980.4503768',
    doi: 'https://doi.org/10.1109/TIA.1980.4503768'
  },
  {
    id: 10,
    title: 'Application of Least-Squares Techniques for Induction Motor Parameters Estimation',
    authors: 'Y. Koubaa',
    year: 2006,
    area: 'Parameter Estimation',
    contribution: 'Applies a least-squares method to find induction motor parameters from measured voltage, current, and speed, without directly measuring rotor flux.',
    link: 'https://doi.org/10.1080/13873950500064103',
    doi: 'https://doi.org/10.1080/13873950500064103'
  },
  {
    id: 11,
    title: 'A Nonlinear Least-Squares Approach for Estimation of the Induction Motor Parameters',
    authors: 'K. Wang et al.',
    year: 2005,
    area: 'Parameter Estimation',
    contribution: 'Proposes a nonlinear least-squares method for estimating unknown motor parameters when some internal rotor quantities cannot be measured directly.',
    link: 'https://doi.org/10.1109/TAC.2005.856661',
    doi: 'https://doi.org/10.1109/TAC.2005.856661'
  },
  {
    id: 12,
    title: 'Advanced Control Strategies of Induction Machine: Field-Oriented Control, Direct Torque Control and Model Predictive Control',
    authors: 'F. Wang et al.',
    year: 2018,
    area: 'Torque and Speed Control',
    contribution: 'Reviews field-oriented control, direct torque control, and model predictive control, explaining their differences and advantages for different motor-drive applications.',
    link: 'https://www.mdpi.com/1996-1073/11/1/120'
  }
]
