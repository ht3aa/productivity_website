
export default function LanguageCard({ imgSrc, languageName, hours }: {imgSrc: string, languageName: string, hours: number}  ) {

  return (
    <div className="flex bg-white items-center my-[20px] p-4 w-[300px]  text-black">
      <img src={imgSrc} className="w-[50px] h-[50px] mr-2" alt="typescript logo" />
      <div>
        <h2>{languageName}: {hours.toFixed(2)} hours</h2>
      </div>
    </div>
  );
}
