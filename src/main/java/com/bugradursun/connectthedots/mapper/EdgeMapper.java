package com.bugradursun.connectthedots.mapper;

import com.bugradursun.connectthedots.dto.EdgeDto;
import com.bugradursun.connectthedots.entity.Edge;
import org.springframework.stereotype.Component;

@Component
public class EdgeMapper {

    public static EdgeDto toDto(Edge edge) {
        return new EdgeDto();
    }
}
