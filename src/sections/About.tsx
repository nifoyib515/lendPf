import { WordsPullUpMultiStyle } from '../components/WordsPullUpMultiStyle';
import { AnimatedParagraph } from '../components/AnimatedLetters';

export default function About() {
  return (
    <section id="about" className="bg-black py-24 md:py-40 px-4 md:px-6">
      <div className="bg-[#101010] rounded-2xl md:rounded-[2rem] max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-32 text-center">
        <p className="text-primary text-[10px] sm:text-xs tracking-widest uppercase mb-6 md:mb-10">
          SEO · Поведенческий фактор
        </p>

        <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-3xl mx-auto leading-[0.95] sm:leading-[0.9] text-primary mb-14 md:mb-20">
          <WordsPullUpMultiStyle
            segments={[
              { text: 'Я — SEO-специалист,', className: 'font-normal' },
              {
                text: 'по поведенческому фактору.',
                className: 'font-serif italic',
              },
              {
                text: 'Вывожу сайты в ТОП Яндекса, увеличиваю CTR, заявки и выручку.',
                className: 'font-normal',
              },
            ]}
          />
        </div>

        <AnimatedParagraph
          text="За последние годы моя команда работала с десятками бизнесов — от ремонтных бригад до онлайн-сервисов. Сайты наших клиентов поднялись с 20–30 позиций до ТОП-3 Яндекса и получают в десятки раз больше органических заявок, чем до старта работы."
          className="max-w-3xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed"
        />
      </div>
    </section>
  );
}
