import React from "react";

import { Img } from "components";

type NFTLandingPageStackProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  Partial<{}>;

const NFTLandingPageStack: React.FC<NFTLandingPageStackProps> = (props) => {
  return (
    <>
      <div className={props.className}>
        <div className="md:h-2.5 h-[5px] mb-[5px] ml-[25px] mt-auto w-[44%]">
          <div className="absolute backdrop-opacity-[0.5] bg-black-900_6c blur-[14.00px] h-[5px] inset-[0] justify-center m-auto rounded-[23px] w-full"></div>
          <div className="absolute backdrop-opacity-[0.5] bg-black-900_90 blur-[7.00px] h-[3px] inset-x-[0] mx-auto rounded-[23px] top-[0] w-full"></div>
        </div>
        <div className="absolute h-[213px] inset-[0] justify-center m-auto w-full">
          <Img
            className="absolute h-[213px] inset-[0] justify-center m-auto object-cover w-full"
            src="images/img_31.png"
            alt="ThirtyOne"
          />
          <div className="absolute flex flex-col gap-12 items-center justify-start left-[33%] top-[32%] w-[28%]">
            <div className="flex flex-row gap-[15px] items-start justify-between w-full">
              <div className="backdrop-opacity-[0.5] bg-orange-200 blur-[3.00px] h-[3px] rounded-[3px] w-[24%]"></div>
              <div className="backdrop-opacity-[0.5] bg-orange-200 blur-[3.00px] h-1 rotate-[6deg] rounded w-[27%]"></div>
            </div>
            <div
              className="bg-cover bg-no-repeat flex flex-col h-[5px] items-center justify-end w-1/2 md:w-full"
              style={{ backgroundImage: "url('images/img_group7.svg')" }}
            >
              <Img
                className="h-[3px]"
                src="images/img_vector122.svg"
                alt="vector122"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

NFTLandingPageStack.defaultProps = {};

export default NFTLandingPageStack;
